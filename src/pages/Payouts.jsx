import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRates, calculatePayouts } from "../store/slices/payoutsSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import toast from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { fetchArticles } from "../store/slices/articlesSlice";
import { Loader2, Download } from "lucide-react";

const Payouts = () => {
    const dispatch = useDispatch();
    const { rates, authorPayouts } = useSelector((state) => state.payouts);
    const { items: articles, loading } = useSelector((state) => state.articles);
    const [pricePerNews, setPricePerNews] = useState(rates.pricePerNews);
    const [pricePerBlog, setPricePerBlog] = useState(rates.pricePerBlog);

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    useEffect(() => {
        if (articles.length > 0) {
            dispatch(calculatePayouts({ articles }));
        }
    }, [articles, dispatch]);

    const handlePriceUpdate = () => {
        dispatch(updateRates({ pricePerNews, pricePerBlog }));
        dispatch(calculatePayouts({ articles }));
        toast.success("Prices updated successfully!");
    };

    const totalPayout = authorPayouts.reduce((sum, author) => sum + author.totalPayout, 0);

    const handleDownloadCSV = () => {
        if (authorPayouts.length === 0) {
            toast.error("No data available to download");
            return;
        }

        // Prepare CSV content
        const headers = ["Author", "News Count", "Blog Count", "Total Payout"];
        const csvContent = [
            headers.join(","),
            ...authorPayouts.map(author => [
                author.author,
                author.newsCount,
                author.blogCount,
                author.totalPayout
            ].join(","))
        ].join("\n");

        // Create and trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `payouts_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV downloaded successfully!");
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading payouts data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Update Prices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Price per News</label>
                            <Input
                                type="number"
                                value={pricePerNews}
                                onChange={(e) => setPricePerNews(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price per Blog</label>
                            <Input
                                type="number"
                                value={pricePerBlog}
                                onChange={(e) => setPricePerBlog(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <Button onClick={handlePriceUpdate} className="w-full">
                            Update Prices
                        </Button>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Total Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalPayout}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Total payout across all authors
                        </p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Current Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>News Rate:</span>
                                <span className="font-medium">₹{rates.pricePerNews}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Blog Rate:</span>
                                <span className="font-medium">₹{rates.pricePerBlog}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center">
                    <CardTitle>Author Payouts</CardTitle>
                    <Button
                        onClick={handleDownloadCSV}
                        variant="outline"
                        className="flex w-fit bg-green-300 hover:bg-green-400 transition-colors duration-500 border-none cursor-pointer items-center gap-2"
                        disabled={authorPayouts.length === 0}
                    >
                        <Download className="h-4 w-4" />
                        Download CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Author</TableHead>
                                    <TableHead className="text-right">News Count</TableHead>
                                    <TableHead className="text-right">Blog Count</TableHead>
                                    <TableHead className="text-right">Total Payout</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {authorPayouts.length > 0 ? (
                                    authorPayouts.map((author) => (
                                        <TableRow key={author.author}>
                                            <TableCell className="font-medium">{author.author}</TableCell>
                                            <TableCell className="text-right">{author.newsCount}</TableCell>
                                            <TableCell className="text-right">{author.blogCount}</TableCell>
                                            <TableCell className="text-right">₹{author.totalPayout}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No payout data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Payouts; 