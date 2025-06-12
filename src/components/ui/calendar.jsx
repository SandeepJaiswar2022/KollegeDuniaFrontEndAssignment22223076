import * as React from "react";
import { addDays, format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import { cn } from "../../lib/utils";

export function Calendar({ mode = "single", selected, onSelect }) {
    const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));

    const days = [];
    let day = startDate;
    while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
    }

    function handleDayClick(day) {
        if (mode === "single") {
            onSelect(day);
        }
    }

    function isSelected(day) {
        return selected && isSameDay(day, selected);
    }

    return (
        <div className="p-4 bg-background rounded-lg shadow-md w-[300px]">
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-2 py-1 rounded hover:bg-accent">{"<"}</button>
                <span className="font-semibold text-foreground">{format(currentMonth, "MMMM yyyy")}</span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-2 py-1 rounded hover:bg-accent">{">"}</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1 text-xs text-center text-muted-foreground">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((dayObj, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleDayClick(dayObj)}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                            isSelected(dayObj) ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground",
                            dayObj.getMonth() !== currentMonth.getMonth() && "opacity-40"
                        )}
                    >
                        {format(dayObj, "d")}
                    </button>
                ))}
            </div>
        </div>
    );
} 