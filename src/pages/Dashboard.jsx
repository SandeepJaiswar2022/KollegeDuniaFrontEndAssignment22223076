import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { fetchArticles } from '../store/slices/articlesSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "../components/ui/badge";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { items: articles, loading, filters } = useSelector((state) => state.articles);
    const { role } = useSelector((state) => state.auth);
    const [dateRange, setDateRange] = useState({
        start: null,
        end: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCard, setSelectedCard] = useState(null);
    const itemsPerPage = 6;
    const [totalItems, setTotalItems] = useState(articles.length);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalItems / itemsPerPage));
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch, filters]);

    useEffect(() => {
        let filtered = [...articles];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (article) =>
                    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply type filter
        if (selectedType !== "all") {
            filtered = filtered.filter((article) => article.type === selectedType);
        }

        // Apply date filter
        if (selectedDate) {
            const filterDate = new Date(selectedDate);
            filtered = filtered.filter((article) => {
                const articleDate = new Date(article.createdAt);
                return articleDate.toDateString() === filterDate.toDateString();
            });
        }

        // Apply status filter
        if (selectedStatus !== "all") {
            filtered = filtered.filter((article) => article.status === selectedStatus);
        }

        // Apply date range filter
        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            filtered = filtered.filter((article) => {
                const articleDate = new Date(article.createdAt);
                return articleDate >= from && articleDate <= to;
            });
        }

        setTotalItems(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));

        // if (filtered?.length === 0) {
        //     toast.error("No data found with these Filters..")
        // }
        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [articles, searchQuery, selectedType, selectedDate, selectedStatus, fromDate, toDate]);

    const handleSearch = () => {
        if (searchQuery) {
            toast.success("Search results updated");
        }
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
        toast.success(`Filtered by type: ${value}`);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleDateSearch = () => {
        if (selectedDate) {
            toast.success(`Filtered by date: ${format(selectedDate, "PPP")}`);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedType("all");
        setSelectedDate(null);
        setSelectedStatus("all");
        setFromDate("");
        setToDate("");
        toast.success("All filters cleared");
    };

    // Prepare data for charts
    const authorStats = articles.reduce((acc, article) => {
        const existing = acc.find(item => item.author === article.author);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ author: article.author, count: 1 });
        }
        return acc;
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCardClick = (cardId) => {
        // Simulate fetching card details
        const cardDetails = cardId ? { id: cardId, title: `Card ${cardId}`, content: "This is a detailed view of the card." } : null;
        setSelectedCard(cardDetails);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredArticles.slice(startIndex, endIndex);

    const hasActiveFilters = searchQuery || selectedType !== "all" || selectedDate || selectedStatus !== "all" || (fromDate && toDate);

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 6;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const half = Math.floor(maxVisiblePages / 2); // 3

            if (currentPage <= half) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - half + 1) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                const start = currentPage - half + 1;
                const end = currentPage + half;
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
            }
        }
        return pages;
    };

    


    return (
        <div className="mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                {role === 'admin' && (
                    <Link to="/admin/payouts">
                        <Button>Manage Payouts</Button>
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-full">
                    <Input
                        placeholder="Search by title, content, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <div className="w-full">
                    <Select value={selectedType} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full">
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-full sm:col-span-2 lg:col-span-1">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 md:flex gap-2">
                            <label className="text-sm md:mt-2 font-medium text-gray-700 dark:text-gray-300 block mb-1">From:</label>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full cursor-pointer"
                            />
                        </div>
                        <div className="flex-1 md:flex gap-2">
                            <label className="text-sm md:mt-2 font-medium text-gray-700 dark:text-white block mb-1">To:</label>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full cursor-pointer dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="col-span-full">
                        <Button className="bg-red-700 text-white border-none w-fit hover:bg-red-900 cursor-pointer" variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{articles.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Unique Authors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {new Set(articles.map(article => article.author)).size}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Article</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            {articles[0]?.title || 'No articles found'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Articles by Author</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={authorStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="author" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((article) => (
                    <Card
                        key={article.id}
                        className="bg-gradient-to-br from-card to-card-foreground/5 cursor-pointer hover:shadow-lg transition-shadow border-indigo-500"
                        onClick={() => handleCardClick(article.id)}
                    >
                        <CardHeader>
                            <CardTitle className="text-foreground">{article.title}</CardTitle>
                            <div className="flex gap-2">
                                <Badge>{article.type}</Badge>
                                <Badge variant={article.status === "published" ? "default" : "secondary"}>
                                    {article.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground">{article.content}</p>
                            <div className="mt-4 flex justify-between items-center text-sm">
                                <span>By {article.author}</span>
                                <span>{new Date(article.date).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {currentItems.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                        No data available! Try adujusting the filters.
                    </p>
                </div>

            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getVisiblePages().map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}



        </div>
    );
};

export default Dashboard; 