'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import { importTransactions } from './actions'
import { useTransition } from 'react'

type ParsedRow = Record<string, string>
type MappedTransaction = {
    date: string
    amount: number
    transaction_type: 'Income' | 'Expense'
    category: string
    method: string
    entity: string
    description: string
}

export default function ImportCsvPage() {
    const [file, setFile] = useState<File | null>(null)
    const [csvType, setCsvType] = useState<'Expense' | 'Allowance'>('Expense')
    const [replaceData, setReplaceData] = useState(false)
    const [mappedData, setMappedData] = useState<MappedTransaction[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const processFile = () => {
        if (!file) return
        setIsProcessing(true)

        Papa.parse<ParsedRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const mapped = results.data.map((row) => {
                    let rawDate = row['Date'] || ''
                    // Convert DD/MM/YYYY to YYYY-MM-DD for Supabase
                    if (rawDate.includes('/')) {
                        const parts = rawDate.split('/')
                        if (parts.length === 3) {
                            rawDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
                        }
                    }

                    if (csvType === 'Expense') {
                        return {
                            date: rawDate,
                            amount: parseFloat(row['Amount (MYR)'] || row['Amount'] || '0'),
                            transaction_type: 'Expense' as const,
                            category: row['Category'] || '',
                            method: row['Payment_Method'] || '',
                            entity: row['Merchant'] || '',
                            description: row['Item_Description'] || '',
                        }
                    } else {
                        return {
                            date: rawDate,
                            amount: parseFloat(row['Amount (MYR)'] || row['Amount'] || '0'),
                            transaction_type: 'Income' as const,
                            category: 'Allowance',
                            method: row['Transfer_Type'] || '',
                            entity: row['Payer'] || '',
                            description: row['Payment_Details'] || '',
                        }
                    }
                })
                setMappedData(mapped)
                setIsProcessing(false)
            },
        })
    }

    const confirmImport = () => {
        startTransition(async () => {
            const result = await importTransactions(mappedData, replaceData, csvType === 'Allowance' ? 'Income' : 'Expense')
            if (result.error) {
                alert(`Error: ${result.error}`)
            } else {
                alert(`Imported ${mappedData.length} records successfully!`)
                setMappedData([])
                setFile(null)
            }
        })
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Import Transactions</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload CSV</CardTitle>
                        <CardDescription>Select your "Expenses" or "Allowance" CSV file.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-max mb-4">
                            <button
                                type="button"
                                onClick={() => setCsvType('Expense')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${csvType === 'Expense' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                Expenses CSV
                            </button>
                            <button
                                type="button"
                                onClick={() => setCsvType('Allowance')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${csvType === 'Allowance' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                Allowance CSV
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 mb-4 p-3 bg-red-50 text-red-900 rounded-lg border border-red-100">
                            <input
                                type="checkbox"
                                id="replace-data"
                                checked={replaceData}
                                onChange={(e) => setReplaceData(e.target.checked)}
                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                            />
                            <label htmlFor="replace-data" className="text-sm font-medium cursor-pointer">
                                Replace existing {csvType === 'Expense' ? 'Expenses' : 'Allowances'} data?
                                <span className="block text-xs font-normal text-red-700 mt-0.5">
                                    This will delete all your old {csvType === 'Expense' ? 'Expense' : 'Income'} records before importing this file.
                                </span>
                            </label>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center flex flex-col items-center justify-center bg-slate-50">
                            <UploadCloud className="h-10 w-10 text-slate-400 mb-4" />
                            <p className="text-sm text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button variant="outline" asChild className="cursor-pointer">
                                    <span>Browse Files</span>
                                </Button>
                            </label>
                            {file && <p className="mt-4 text-sm font-medium text-slate-900">{file.name}</p>}
                        </div>

                        <Button onClick={processFile} disabled={!file || isProcessing} className="w-full">
                            Process & Preview
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Verification Preview</CardTitle>
                        <CardDescription>Review the parsed data before importing.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mappedData.length > 0 ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Successfully mapped {mappedData.length} rows
                                </div>

                                <div className="max-h-[300px] overflow-auto border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Type</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mappedData.slice(0, 5).map((row, i) => (
                                                <tr key={i} className="border-b last:border-0 bg-white hover:bg-slate-50">
                                                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.transaction_type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {row.transaction_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">RM {row.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-3 truncate max-w-[100px]">{row.category}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {mappedData.length > 5 && (
                                        <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t">
                                            Showing 5 of {mappedData.length} rows
                                        </div>
                                    )}
                                </div>

                                <Button onClick={confirmImport} disabled={isPending} className="w-full bg-green-600 hover:bg-green-700">
                                    {isPending ? 'Importing...' : 'Confirm & Import Data'}
                                </Button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px] border-2 border-dashed rounded-lg p-4">
                                <p>Upload a file and click process to see a preview here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
