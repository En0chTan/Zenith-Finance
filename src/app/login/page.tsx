import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Landmark, ShieldCheck, TrendingUp } from 'lucide-react'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string }> }) {
    const params = await searchParams
    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-col flex-1 bg-slate-950 text-white p-12 justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-12">
                        <Landmark className="h-8 w-8 text-blue-400" />
                        <span className="text-2xl font-bold tracking-tight">MyDOIT</span>
                    </div>
                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
                            Elevate your financial future with confidence.
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Secure, intelligent, and seamless wealth management platform for the modern investor.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 border-l-2 border-blue-500 pl-4">
                        <ShieldCheck className="h-6 w-6 text-blue-400" />
                        <div>
                            <h3 className="font-medium text-slate-200">Bank-grade Security</h3>
                            <p className="text-sm text-slate-400">Your assets are protected with state-of-the-art encryption.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-l-2 border-blue-500 pl-4">
                        <TrendingUp className="h-6 w-6 text-blue-400" />
                        <div>
                            <h3 className="font-medium text-slate-200">Intelligent Insights</h3>
                            <p className="text-sm text-slate-400">AI-driven analytics to maximize your portfolio growth.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 border-l dark:border-slate-800">
                <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
                    <CardHeader className="space-y-2 pb-6">
                        <div className="lg:hidden flex items-center gap-2 mb-4 justify-center">
                            <Landmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MyDOIT</span>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your secure portal.
                        </CardDescription>
                    </CardHeader>
                    <form action={login}>
                        <CardContent className="space-y-4">
                            {params?.message && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md text-center">
                                    {params.message}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="client@example.com"
                                    required
                                    className="bg-white dark:bg-slate-950"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-white dark:bg-slate-950"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-4">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit">Secure Log In</Button>
                            <div className="text-sm text-center text-slate-500 dark:text-slate-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                                    Open an account
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
