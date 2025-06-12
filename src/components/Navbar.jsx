import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/useTheme";
import { SquareMenu, Moon, Sun, X, BookOpen } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
} from "./ui/sheet";
import { signOut } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { user, role } = useSelector((state) => state.auth);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobileView(window.innerWidth < 1024);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleSignOut = async () => {

        try {
            await dispatch(signOut()).unwrap();
            navigate("/login");
            toast.success("Logged Out Successfully!")
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    const NavLinks = () => (
        <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-indigo-500" : "text-foreground"} onClick={() => setIsSheetOpen(false)}>
                Dashboard
            </NavLink>
            {role === 'admin' && <NavLink to="/admin/payouts" className={({ isActive }) => isActive ? "text-indigo-500" : "text-foreground"} onClick={() => setIsSheetOpen(false)}>
                Payouts
            </NavLink>}
        </>
    );

    return (
        <nav className="bg-background border-b border-border py-3">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/" className="text-foreground  flex items-center">
                    <BookOpen size={30} className="mr-2 mt-1" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold ">BlinkRead</span>
                        <span className="text-sm italic">Curated stories. Reliable voices</span>
                    </div>
                </NavLink>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-6">
                    <NavLinks />
                    {user && <span className="text-foreground">{user.email} ({role})</span>}
                    <Button variant="ghost" onClick={toggleTheme} className="text-foreground cursor-pointer hover:bg-accent">
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                    {user ? (
                        <div className="flex items-center space-x-4">

                            <Button variant="ghost" className="text-foreground hover:bg-accent cursor-pointer" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button variant="ghost" className="text-foreground hover:bg-accent cursor-pointer" onClick={() => navigate("/login")}>
                            Sign In
                        </Button>
                    )}
                </div>

                {/* Mobile Navigation */}
                {(isMobileView && !isSheetOpen) && (
                    <Button onClick={() => setIsSheetOpen(!isSheetOpen)} variant="ghost" size="icon" className="block lg:hidden">
                        <SquareMenu className="h-5 w-5" />
                    </Button>
                )}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                        <SheetHeader>
                            {/* <SheetTitle>Menu</SheetTitle> */}
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsSheetOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetHeader>
                        <div className="flex flex-col space-y-4 mt-6">
                            <NavLinks />
                            {user && <div className="text-foreground py-2">{user.email} [{role}]</div>}
                            <Button variant="ghost" onClick={() => { toggleTheme(); setIsSheetOpen(false); }} className="text-foreground w-fit hover:bg-accent justify-start">
                                {theme === "dark" ? <Sun size={18} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                                {theme === "dark" ? "Light" : "Dark"}
                            </Button>
                            {user ? (
                                <>

                                    <Button variant="ghost" className="text-foreground w-fit cursor-pointer hover:bg-accent justify-start" onClick={handleSignOut}>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Button variant="ghost" className="text-foreground cursor-pointer hover:bg-accent justify-start" onClick={() => { navigate("/login"); setIsSheetOpen(false); }}>
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
} 