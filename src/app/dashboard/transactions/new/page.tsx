'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewTransactionPage() {
    const [type, setType] = useState('Expense')

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Transaction</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Manual Entry</CardTitle>
                    <CardDescription>Enter details of your income or expense</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-max">
                            <button
                                type="button"
                                onClick={() => setType('Expense')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${type === 'Expense' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('Income')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${type === 'Income' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                Income
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (MYR)</Label>
                                <Input id="amount" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" placeholder={type === 'Income' ? 'Allowance' : 'Food, Transport...'} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="method">Method</Label>
                                <Input id="method" placeholder="Cash, Card, Transfer..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="entity">Entity (Merchant / Payer)</Label>
                            <Input id="entity" placeholder="e.g. MMU Cafe, Parent" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="Optional details..." />
                        </div>

                        <Button type="submit" className="w-full">
                            Save {type}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
