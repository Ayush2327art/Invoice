import { useRef, useEffect, useState } from 'react';
import { calculateSubtotal, calculateTax, calculateDiscount, calculateTotal } from '../utils/invoiceUtils';
import html2pdf from 'html2pdf.js';

const getCurrencySymbol = (currency) => {
  switch(currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'INR':
      return '₹';
    case 'JPY':
      return '¥';
    case 'CAD':
      return 'C$';
    case 'AUD':
      return 'A$';
    default:
      return '$';
  }
};

const InvoicePreview = ({ invoiceData }) => {
  const invoiceRef = useRef();
  
  const printInvoice = () => {
    const printContents = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const downloadAsPdf = () => {
    const element = invoiceRef.current;
    const filename = `Invoice_${invoiceData.invoiceNumber}.pdf`;
    
    // Set the html2pdf options
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    html2pdf().set(opt).from(element).save();
  };

  const subtotal = calculateSubtotal(invoiceData.items);
  const tax = calculateTax(subtotal, invoiceData.taxRate);
  const discount = calculateDiscount(subtotal, invoiceData.discountRate);
  const total = calculateTotal(subtotal, tax, discount);

  const formattedDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Preview Invoice</h2>
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={printInvoice} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Print
        </button>
        <button 
          onClick={downloadAsPdf} 
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>
      
      <div 
        ref={invoiceRef} 
        className="border border-gray-300 p-6 bg-white shadow-sm"
      >
        <div className="flex justify-between mb-8">
          <div className="flex items-start">
            {invoiceData.companyLogo && (
              <img 
                src={invoiceData.companyLogo} 
                alt="Company logo" 
                className="h-16 w-auto object-contain mr-4"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
              <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
              <p className="text-gray-600">Currency: {invoiceData.currency}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-800">{invoiceData.companyName}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.companyAddress}</p>
            <p className="text-gray-600">{invoiceData.companyEmail}</p>
            <p className="text-gray-600">{invoiceData.companyPhone}</p>
            {invoiceData.companyTaxId && (
              <p className="text-gray-600">Tax ID: {invoiceData.companyTaxId}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Bill To:</h2>
            <p className="font-bold text-gray-800">{invoiceData.clientName}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.clientAddress}</p>
            <p className="text-gray-600">{invoiceData.clientEmail}</p>
            <p className="text-gray-600">{invoiceData.clientPhone}</p>
            {invoiceData.clientTaxId && (
              <p className="text-gray-600">Tax ID: {invoiceData.clientTaxId}</p>
            )}
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm font-bold uppercase text-gray-500">Issue Date:</p>
              <p className="text-right">{formattedDate(invoiceData.issueDate)}</p>
              
              <p className="text-sm font-bold uppercase text-gray-500">Due Date:</p>
              <p className="text-right">{formattedDate(invoiceData.dueDate)}</p>
              
              {invoiceData.paymentTerms && (
                <>
                  <p className="text-sm font-bold uppercase text-gray-500">Payment Terms:</p>
                  <p className="text-right">{invoiceData.paymentTerms}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-3">Item</th>
                <th className="text-right py-2 px-3">Qty</th>
                <th className="text-right py-2 px-3">Price</th>
                <th className="text-right py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map(item => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 px-3">{item.description}</td>
                  <td className="text-right py-2 px-3">{item.quantity}</td>
                  <td className="text-right py-2 px-3">{getCurrencySymbol(invoiceData.currency)}{item.price.toFixed(2)}</td>
                  <td className="text-right py-2 px-3">{getCurrencySymbol(invoiceData.currency)}{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between border-b border-gray-200 py-2">
              <span>Subtotal:</span>
              <span>{getCurrencySymbol(invoiceData.currency)}{subtotal.toFixed(2)}</span>
            </div>
            
            {invoiceData.discountRate > 0 && (
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span>Discount ({invoiceData.discountRate}%):</span>
                <span>-{getCurrencySymbol(invoiceData.currency)}{discount.toFixed(2)}</span>
              </div>
            )}
            
            {invoiceData.taxRate > 0 && (
              <div className="flex justify-between border-b border-gray-200 py-2">
                <span>Tax ({invoiceData.taxRate}%):</span>
                <span>{getCurrencySymbol(invoiceData.currency)}{tax.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span>{getCurrencySymbol(invoiceData.currency)}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoiceData.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Notes:</h2>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
          </div>
        )}
        
        {invoiceData.termsAndConditions && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Terms & Conditions:</h2>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.termsAndConditions}</p>
          </div>
        )}
        
        {/* Payment Methods Section */}
        {invoiceData.paymentMethods && Object.values(invoiceData.paymentMethods).some(value => value) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Payment Methods:</h2>
            <div className="flex flex-wrap gap-2">
              {invoiceData.paymentMethods.bankTransfer && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Bank Transfer</span>
              )}
              {invoiceData.paymentMethods.upi && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">UPI</span>
              )}
              {invoiceData.paymentMethods.crypto && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Crypto</span>
              )}
              {invoiceData.paymentMethods.paypal && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">PayPal</span>
              )}
              {invoiceData.paymentMethods.cash && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Cash</span>
              )}
              {invoiceData.paymentMethods.paymentLink && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">Payment Link</span>
              )}
            </div>
          </div>
        )}
        
        {/* Payment Details - Dynamic based on selected payment methods */}
        {invoiceData.paymentMethods.bankTransfer && invoiceData.bankDetails && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Bank Transfer Details:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              {invoiceData.bankDetails.bankName && <p className="text-gray-600"><span className="font-semibold">Bank Name:</span> {invoiceData.bankDetails.bankName}</p>}
              {invoiceData.bankDetails.accountHolderName && <p className="text-gray-600"><span className="font-semibold">Account Holder:</span> {invoiceData.bankDetails.accountHolderName}</p>}
              {invoiceData.bankDetails.accountNumber && <p className="text-gray-600"><span className="font-semibold">Account Number:</span> {invoiceData.bankDetails.accountNumber}</p>}
              {invoiceData.bankDetails.accountType && <p className="text-gray-600"><span className="font-semibold">Account Type:</span> {invoiceData.bankDetails.accountType}</p>}
              {invoiceData.bankDetails.swiftCode && <p className="text-gray-600"><span className="font-semibold">IFSC/SWIFT Code:</span> {invoiceData.bankDetails.swiftCode}</p>}
            </div>
          </div>
        )}
        
        {invoiceData.paymentMethods.upi && invoiceData.upiId && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">UPI Payment:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              <p className="text-gray-600"><span className="font-semibold">UPI ID:</span> {invoiceData.upiId}</p>
            </div>
          </div>
        )}
        
        {invoiceData.paymentMethods.paypal && invoiceData.paypalId && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">PayPal Payment:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              <p className="text-gray-600"><span className="font-semibold">PayPal ID:</span> {invoiceData.paypalId}</p>
            </div>
          </div>
        )}
        
        {invoiceData.paymentMethods.crypto && invoiceData.cryptoWalletAddress && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Crypto Payment:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              <p className="text-gray-600"><span className="font-semibold">Wallet Address:</span> {invoiceData.cryptoWalletAddress}</p>
            </div>
          </div>
        )}
        
        {invoiceData.paymentMethods.cash && invoiceData.cashInstructions && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Cash Payment Instructions:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              <p className="text-gray-600 whitespace-pre-line">{invoiceData.cashInstructions}</p>
            </div>
          </div>
        )}
        
        {invoiceData.paymentMethods.paymentLink && invoiceData.paymentDetails && (
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Payment Link:</h2>
            <div className="pl-2 border-l-2 border-gray-200">
              <p className="text-gray-600 break-all">
                <a href={invoiceData.paymentDetails} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {invoiceData.paymentDetails}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;