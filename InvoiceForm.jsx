import { useState } from 'react';
import FormField from './FormField';
import ItemList from './ItemList';

const InvoiceForm = ({ invoiceData, onDataChange }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  const handleInputChange = (field, value) => {
    onDataChange({ [field]: value });
  };

  const handleItemsChange = (newItems) => {
    onDataChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Invoice Settings</h2>
        
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button 
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Invoice Details
          </button>
          <button 
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('company')}
          >
            Your Info
          </button>
          <button 
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'client' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('client')}
          >
            Client Info
          </button>
          <button 
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'items' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('items')}
          >
            Items
          </button>
          <button 
            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment Methods
          </button>
        </div>
      </div>
      
      {activeTab === 'details' && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Company Logo</label>
            <div className="flex items-center">
              {invoiceData.companyLogo && (
                <div className="mr-4">
                  <img 
                    src={invoiceData.companyLogo} 
                    alt="Company logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleInputChange('companyLogo', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {invoiceData.companyLogo && (
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleInputChange('companyLogo', null)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField 
              label="Invoice Number" 
              type="text" 
              value={invoiceData.invoiceNumber}
              onChange={e => handleInputChange('invoiceNumber', e.target.value)}
            />
            <div>
              <label className="block text-gray-700 font-medium mb-2">Currency</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={invoiceData.currency}
                onChange={e => handleInputChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <FormField 
              label="Issue Date" 
              type="date" 
              value={invoiceData.issueDate}
              onChange={e => handleInputChange('issueDate', e.target.value)}
            />
            <FormField 
              label="Due Date" 
              type="date" 
              value={invoiceData.dueDate}
              onChange={e => handleInputChange('dueDate', e.target.value)}
            />
            <FormField 
              label="Payment Terms" 
              type="text" 
              value={invoiceData.paymentTerms}
              onChange={e => handleInputChange('paymentTerms', e.target.value)}
              placeholder="e.g., Net 30 days, Due on Receipt"
            />
          </div>
          
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Tax Rate (%)" 
                type="number" 
                min="0"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={e => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              />
              <FormField 
                label="Discount Rate (%)" 
                type="number" 
                min="0"
                step="0.01"
                value={invoiceData.discountRate}
                onChange={e => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <FormField 
              label="Notes" 
              type="textarea" 
              value={invoiceData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes to client..."
            />
          </div>
          
          <div className="mt-4">
            <FormField 
              label="Terms & Conditions" 
              type="textarea" 
              value={invoiceData.termsAndConditions}
              onChange={e => handleInputChange('termsAndConditions', e.target.value)}
              placeholder="Invoice terms and conditions..."
            />
          </div>
        </div>
      )}

      {activeTab === 'company' && (
        <div>
          <FormField 
            label="Company Name" 
            type="text" 
            value={invoiceData.companyName}
            onChange={e => handleInputChange('companyName', e.target.value)}
          />
          <FormField 
            label="Address" 
            type="textarea" 
            value={invoiceData.companyAddress}
            onChange={e => handleInputChange('companyAddress', e.target.value)}
          />
          <FormField 
            label="Email" 
            type="email" 
            value={invoiceData.companyEmail}
            onChange={e => handleInputChange('companyEmail', e.target.value)}
          />
          <FormField 
            label="Phone" 
            type="text" 
            value={invoiceData.companyPhone}
            onChange={e => handleInputChange('companyPhone', e.target.value)}
          />
          <FormField 
            label="Tax ID / VAT Number" 
            type="text" 
            value={invoiceData.companyTaxId}
            onChange={e => handleInputChange('companyTaxId', e.target.value)}
            placeholder="e.g., 123-45-6789 or VAT12345678"
          />
        </div>
      )}

      {activeTab === 'client' && (
        <div>
          <FormField 
            label="Client Name" 
            type="text" 
            value={invoiceData.clientName}
            onChange={e => handleInputChange('clientName', e.target.value)}
          />
          <FormField 
            label="Client Address" 
            type="textarea" 
            value={invoiceData.clientAddress}
            onChange={e => handleInputChange('clientAddress', e.target.value)}
          />
          <FormField 
            label="Client Email" 
            type="email" 
            value={invoiceData.clientEmail}
            onChange={e => handleInputChange('clientEmail', e.target.value)}
          />
          <FormField 
            label="Client Phone" 
            type="text" 
            value={invoiceData.clientPhone}
            onChange={e => handleInputChange('clientPhone', e.target.value)}
          />
          <FormField 
            label="Client Tax ID / VAT Number" 
            type="text" 
            value={invoiceData.clientTaxId}
            onChange={e => handleInputChange('clientTaxId', e.target.value)}
            placeholder="e.g., 123-45-6789 or VAT12345678"
          />
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          <ItemList items={invoiceData.items} onChange={handleItemsChange} />
        </div>
      )}

      {activeTab === 'payment' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3">How does this invoice get paid?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bankTransfer"
                  checked={invoiceData.paymentMethods.bankTransfer}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      bankTransfer: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="bankTransfer" className="ml-2 block text-gray-700">
                  Bank Transfer
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="upi"
                  checked={invoiceData.paymentMethods.upi}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      upi: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="upi" className="ml-2 block text-gray-700">
                  UPI
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="crypto"
                  checked={invoiceData.paymentMethods.crypto}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      crypto: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="crypto" className="ml-2 block text-gray-700">
                  Crypto
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paypal"
                  checked={invoiceData.paymentMethods.paypal}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      paypal: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="paypal" className="ml-2 block text-gray-700">
                  PayPal
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cash"
                  checked={invoiceData.paymentMethods.cash}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      cash: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="cash" className="ml-2 block text-gray-700">
                  Cash
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paymentLink"
                  checked={invoiceData.paymentMethods.paymentLink}
                  onChange={e => onDataChange({
                    paymentMethods: {
                      ...invoiceData.paymentMethods,
                      paymentLink: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="paymentLink" className="ml-2 block text-gray-700">
                  Payment Link
                </label>
              </div>
            </div>
          </div>
          
          {/* Dynamic payment details based on selected payment methods */}
          {invoiceData.paymentMethods.bankTransfer && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Bank Transfer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Bank Name" 
                  type="text" 
                  value={invoiceData.bankDetails?.bankName || ''}
                  onChange={e => onDataChange({
                    bankDetails: {
                      ...invoiceData.bankDetails,
                      bankName: e.target.value
                    }
                  })}
                />
                <FormField 
                  label="Account Holder Name" 
                  type="text" 
                  value={invoiceData.bankDetails?.accountHolderName || ''}
                  onChange={e => onDataChange({
                    bankDetails: {
                      ...invoiceData.bankDetails,
                      accountHolderName: e.target.value
                    }
                  })}
                />
                <FormField 
                  label="Account Number" 
                  type="text" 
                  value={invoiceData.bankDetails?.accountNumber || ''}
                  onChange={e => onDataChange({
                    bankDetails: {
                      ...invoiceData.bankDetails,
                      accountNumber: e.target.value
                    }
                  })}
                />
                <FormField 
                  label="Account Type" 
                  type="text" 
                  value={invoiceData.bankDetails?.accountType || ''}
                  onChange={e => onDataChange({
                    bankDetails: {
                      ...invoiceData.bankDetails,
                      accountType: e.target.value
                    }
                  })}
                  placeholder="e.g., Savings, Current, Checking"
                />
                <FormField 
                  label="IFSC/SWIFT Code" 
                  type="text" 
                  value={invoiceData.bankDetails?.swiftCode || ''}
                  onChange={e => onDataChange({
                    bankDetails: {
                      ...invoiceData.bankDetails,
                      swiftCode: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          )}

          {invoiceData.paymentMethods.upi && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">UPI Details</h4>
              <FormField 
                label="UPI ID" 
                type="text" 
                value={invoiceData.upiId}
                onChange={e => handleInputChange('upiId', e.target.value)}
                placeholder="e.g., name@bank"
              />
            </div>
          )}

          {invoiceData.paymentMethods.paypal && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">PayPal Details</h4>
              <FormField 
                label="PayPal ID" 
                type="text" 
                value={invoiceData.paypalId}
                onChange={e => handleInputChange('paypalId', e.target.value)}
                placeholder="e.g., your.email@example.com"
              />
            </div>
          )}

          {invoiceData.paymentMethods.crypto && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Crypto Details</h4>
              <FormField 
                label="Crypto Wallet Address" 
                type="text" 
                value={invoiceData.cryptoWalletAddress}
                onChange={e => handleInputChange('cryptoWalletAddress', e.target.value)}
                placeholder="Enter your wallet address"
              />
            </div>
          )}

          {invoiceData.paymentMethods.cash && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Cash Payment Instructions</h4>
              <FormField 
                label="Cash Payment Instructions" 
                type="textarea" 
                value={invoiceData.cashInstructions}
                onChange={e => handleInputChange('cashInstructions', e.target.value)}
                placeholder="Enter instructions for cash payment"
              />
            </div>
          )}
          
          {invoiceData.paymentMethods.paymentLink && (
            <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">Payment Link</h4>
              <FormField 
                label="Payment Link URL" 
                type="text" 
                value={invoiceData.paymentDetails}
                onChange={e => handleInputChange('paymentDetails', e.target.value)}
                placeholder="Enter the payment link URL"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;