import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { Wallet, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const CapitalCard = ({ capital, variant = "detailed", onEdit, onDelete }) => {
  const { getCapitalBalance, getInitialBalance, sources, settings } = useExpenses();

  const balance = getCapitalBalance(capital.id);
  const initial = getInitialBalance(capital.id);
  const percentage =
    initial > 0 ? Math.max(0, Math.min(100, (balance / initial) * 100)) : 0;

  // Get fund breakdown for preview
  const capitalSources = sources.filter(s => s.capitalId === capital.id);
  const getFundsPreview = () => {
    if (capitalSources.length === 0) return { types: [], lastUpdate: null };
    
    const allFunds = [];
    capitalSources.forEach(source => {
      if (source.breakdown) {
        const parts = source.breakdown.split(', ');
        parts.forEach(part => {
          const match = part.match(/(.+?):\s*(.+?)\s*-\s*[^\d]*([\d.]+)/);
          if (match) {
            const [, type, desc, amt] = match;
            const typeKey = type.trim();
            
            const existing = allFunds.find(f => f.type === typeKey);
            if (existing) {
              existing.total += Number(amt);
            } else {
              allFunds.push({
                type: typeKey,
                total: Number(amt)
              });
            }
          }
        });
      }
    });
    
    const lastUpdate = capitalSources.length > 0 
      ? new Date(capitalSources[0].date)
      : null;
    
    return { types: allFunds, lastUpdate };
  };

  const fundsPreview = getFundsPreview();

  const colorMap = {
    blue: {
      bg: "bg-blue-500",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-500",
      iconText: "text-blue-600",
      bar: "bg-blue-500",
      border: "group-hover:text-blue-500",
    },
    emerald: {
      bg: "bg-emerald-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-500",
      iconText: "text-emerald-600",
      bar: "bg-emerald-500",
      border: "group-hover:text-emerald-500",
    },
    rose: {
      bg: "bg-rose-500",
      lightBg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-500",
      iconText: "text-rose-600",
      bar: "bg-rose-500",
      border: "group-hover:text-rose-500",
    },
    amber: {
      bg: "bg-amber-500",
      lightBg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-500",
      iconText: "text-amber-600",
      bar: "bg-amber-500",
      border: "group-hover:text-amber-500",
    },
    indigo: {
      bg: "bg-indigo-500",
      lightBg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-500",
      iconText: "text-indigo-600",
      bar: "bg-indigo-500",
      border: "group-hover:text-indigo-500",
    },
    violet: {
      bg: "bg-violet-500",
      lightBg: "bg-violet-50 dark:bg-violet-900/20",
      text: "text-violet-500",
      iconText: "text-violet-600",
      bar: "bg-violet-500",
      border: "group-hover:text-violet-500",
    },
    purple: {
      bg: "bg-purple-500",
      lightBg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-500",
      iconText: "text-purple-600",
      bar: "bg-purple-500",
      border: "group-hover:text-purple-500",
    },
    pink: {
      bg: "bg-pink-500",
      lightBg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-500",
      iconText: "text-pink-600",
      bar: "bg-pink-500",
      border: "group-hover:text-pink-500",
    },
    cyan: {
      bg: "bg-cyan-500",
      lightBg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-500",
      iconText: "text-cyan-600",
      bar: "bg-cyan-500",
      border: "group-hover:text-cyan-500",
    },
    teal: {
      bg: "bg-teal-500",
      lightBg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-500",
      iconText: "text-teal-600",
      bar: "bg-teal-500",
      border: "group-hover:text-teal-500",
    },
    lime: {
      bg: "bg-lime-500",
      lightBg: "bg-lime-50 dark:bg-lime-900/20",
      text: "text-lime-500",
      iconText: "text-lime-600",
      bar: "bg-lime-500",
      border: "group-hover:text-lime-500",
    },
    orange: {
      bg: "bg-orange-500",
      lightBg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-500",
      iconText: "text-orange-600",
      bar: "bg-orange-500",
      border: "group-hover:text-orange-500",
    },
  };

  const colors = colorMap[capital.color] || colorMap.blue;

  const handleEdit = (e) => {
    if (onEdit) onEdit(capital, e);
  };

  const handleDelete = (e) => {
    if (onDelete) onDelete(capital, e);
  };

  if (variant === "compact") {
    return (
      <Link href={`/capitals/${capital.id}`} className="block group">
        <div className="bg-[var(--card)] border border-[var(--card-border)] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="bg-[var(--card)] rounded-2xl  transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center text-white`}
              >
                <Wallet size={24} />
              </div>
              <div>
                <h4 className="font-bold">{capital.name}</h4>
                <p className="text-[var(--muted)] text-xs">Available Capital</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-bold text-lg">
                  <span className="text-xs opacity-60 mr-0.5">
                    {settings.currency}
                  </span>
                  {balance.toLocaleString()}
                </p>
              </div>
              <ChevronRight
                size={18}
                className={`text-neutral-300 ${colors.border} transition-colors`}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-[var(--input)] rounded-full mb-3 mt-4  overflow-hidden">
            <div
              className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Footer Stats */}
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] m-2">
            <span>
              INITIAL: {settings.currency}
              {initial.toLocaleString()}
            </span>
            <span className={colors.text}>{Math.round(percentage)}% LEFT</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/capitals/${capital.id}`} className="block group">
      <div className="bg-[var(--card)] border border-[var(--card-border)] p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        {/* Header: Icon, Name & Actions */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 ${colors.bg} rounded-[19px] flex items-center justify-center text-white shadow-lg`}
            >
              <Wallet size={27} />
            </div>
            <h3 className="text-2xl font-bold">{capital.name}</h3>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit Capital"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
              title="Delete Capital"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Balance Row */}
        <div className="flex justify-between items-end mb-3">
          <span className="text-[var(--muted)] font-medium">Balance</span>
          <p className="text-2xl font-bold">
            <span className="text-sm mr-0.5 opacity-70">
              {settings.currency}
            </span>
            {balance.toLocaleString()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-[var(--input)] rounded-full mb-4 overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Fund Preview Section */}
        {fundsPreview.types.length > 0 && (
          <div className="mb-4 p-3 bg-[var(--input)] rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Fund Details</p>
              {fundsPreview.lastUpdate && (
                <p className="text-[10px] text-[var(--muted)]">
                  {fundsPreview.lastUpdate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {fundsPreview.lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              {fundsPreview.types.map((fund, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)] font-medium">{fund.type}</span>
                  <span className="font-bold">{settings.currency}{fund.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          <span>
            INITIAL: {settings.currency}
            {initial.toLocaleString()}
          </span>
          <span className={colors.text}>{Math.round(percentage)}% LEFT</span>
        </div>
      </div>
    </Link>
  );
};

export default CapitalCard;
