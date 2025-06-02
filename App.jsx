import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split('T')[0];
    })(),
    paymentTerms: 'Net 30 days',
    currency: 'USD',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    companyTaxId: '',
    companyLogo: null,
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    clientTaxId: '',
    items: [
      { id: 1, description: '', quantity: 1, price: 0 }
    ],
    taxRate: 0,
    discountRate: 0,
    notes: '',
    termsAndConditions: 'Payment is due within 30 days. Please make checks payable to your company name or use the electronic payment information provided on the invoice.',
    paymentMethods: {
      bankTransfer: false,
      upi: false,
      crypto: false,
      paypal: false,
      cash: false,
      paymentLink: false
    },
    paymentDetails: '',
    bankDetails: {
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      accountType: '',
      swiftCode: ''
    },
    upiId: '',
    paypalId: '',
    cryptoWalletAddress: '',
    cashInstructions: ''
  });

  const handleDataChange = (updatedData) => {
    setInvoiceData(prevData => ({
      ...prevData,
      ...updatedData
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Invoice Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <InvoiceForm 
              invoiceData={invoiceData} 
              onDataChange={handleDataChange} 
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Create professional invoices in seconds. All data stays on your device.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;