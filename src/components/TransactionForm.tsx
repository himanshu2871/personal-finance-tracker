import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Import Label for better form accessibility
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Shadcn/ui Select components

interface Transaction {
  _id?: string;
  amount: number;
  date: Date;
  description: string;
  category: string; // Category property
}

interface TransactionFormProps {
  onTransactionAdded: (transaction: Omit<Transaction, '_id'>) => void;
  editingTransaction: Transaction | null;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Entertainment',
  'Personal Care ',
  'Education',
  'Travel',
  'Shopping',
  'Debt & Loans',
  'Savings & Investments',
  'Miscellaneous',
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded, editingTransaction }) => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0]); // Default to the first category
  const [amountError, setAmountError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [categoryError, setCategoryError] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setAmountError('');
      setDateError('');
      setDescriptionError('');
      setCategoryError('');
    } else {
      setAmount(undefined);
      setDate(new Date());
      setDescription('');
      setCategory(categories[0]);
      setAmountError('');
      setDateError('');
      setDescriptionError('');
      setCategoryError('');
    }
  }, [editingTransaction]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (amount === undefined || isNaN(amount) || amount <= 0) {
      setAmountError('Please enter a valid positive amount.');
      isValid = false;
    } else {
      setAmountError('');
    }

    if (!date) {
      setDateError('Please select a date.');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!description.trim()) {
      setDescriptionError('Please enter a description.');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!category) {
      setCategoryError('Please select a category.');
      isValid = false;
    } else {
      setCategoryError('');
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      const newTransaction: Omit<Transaction, '_id'> = {
        amount: amount!,
        date: date,
        description: description.trim(),
        category: category.trim(), // Trim the category here!
      };
      onTransactionAdded(newTransaction);
      if (!editingTransaction) {
        setAmount(undefined);
        setDate(new Date());
        setDescription('');
        setCategory(categories[0]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          id="amount"
          value={amount === undefined ? '' : amount}
          onChange={(e) => setAmount(e.target.valueAsNumber)}
          placeholder="Enter amount"
        />
        {amountError && <p className="mt-1 text-sm text-red-500">{amountError}</p>}
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        {dateError && <p className="mt-1 text-sm text-red-500">{dateError}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        {descriptionError && <p className="mt-1 text-sm text-red-500">{descriptionError}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoryError && <p className="mt-1 text-sm text-red-500">{categoryError}</p>}
      </div>
      <Button type="submit">{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</Button>
    </form>
  );
};

export default TransactionForm;