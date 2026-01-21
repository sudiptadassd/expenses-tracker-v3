"use client";

import React from "react";
import { useExpenses } from "@/context/ExpenseContext";
import {
  ArrowUpCircle,
  MoveDownLeft,
  MoveUpRight,
  ArrowRight,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

const TransactionCard = ({ transaction, onEdit, onDelete, showActions = false }) => {
  const { capitals, settings } = useExpenses();
  const isCredit = transaction.type === "CREDIT";
  const capital = capitals.find((c) => c.id === transaction.capitalId);
  const isDeleted = transaction.capitalDeleted || transaction.fundDeleted || transaction.expenseDeleted;

  const formatDate = (dateString) => {
    const d = new Date(dateString);

    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear().toString().slice(-2);

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12;

    return `${day} ${month} ${year}, ${hours}:${minutes}${ampm}`;
  };

  // Format breakdown: split on commas and periods for better readability
  const formatBreakdown = (breakdown) => {
    if (!breakdown) return null;
    // Split on commas, trim whitespace, and filter empty strings
    return breakdown.split(',').map(part => part.trim()).filter(part => part);
  };

  const breakdownLines = formatBreakdown(transaction.breakdown);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCredit
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {isCredit ? <MoveDownLeft size={20} /> : <MoveUpRight size={20} />}
          </div> */}
          <div>
            <h4 className="font-bold text-sm leading-tight">
              {transaction.note || (isCredit ? "Source" : "Expense")}
            </h4>
            <p className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-wider">
              {capital?.name || transaction.capitalName || "Unknown Capital"} • {transaction.type}
            </p>
            {/* Show deletion tag if present */}
            {isDeleted && transaction.deletedTag && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[9px] font-semibold rounded-full uppercase tracking-wider">
                {transaction.deletedTag}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex justify-end items-center gap-2">
            {showActions && isCredit && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(transaction)}
                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            <p
              className={`font-bold ${
                isCredit ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isCredit ? "+" : "-"}
              {settings.currency}
              {transaction.amount.toLocaleString()}
            </p>
            <div
              className={`w-10 h-10 rounded-full  flex items-center justify-center ${
                isCredit
                  ? "transparent text-emerald-600"
                  : "transparent text-rose-600"
              }`}
            >
              {isCredit ? (
                <MoveDownLeft size={20} />
              ) : (
                <MoveUpRight size={20} />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-neutral-400 justify-end mt-0.5">
            <Clock size={10} />
            {formatDate(transaction.date)}
          </div>
        </div>
      </div>

      {breakdownLines && breakdownLines.length > 0 && (
        <div className="mb-3 p-3 bg-[var(--input)] rounded-xl text-xs text-[var(--muted)] leading-relaxed italic border-l-2 border-neutral-200 dark:border-neutral-700">
          {breakdownLines.map((line, index) => (
            <div key={index} className={index > 0 ? 'mt-1' : ''}>
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Ledger Details (Notebook Style) */}
      <div className="mt-3 pt-3 border-t border-neutral-50 dark:border-neutral-800/50 flex items-center justify-between text-[11px]">
        <div className="flex flex-col">
          <span className="text-[var(--muted)] opacity-70 mb-0.5 italic">
            Balance Before
          </span>
          <span className="font-semibold text-[var(--muted)]">
            {settings.currency}
            {transaction.balanceBefore.toLocaleString()}
          </span>
        </div>
        <ArrowRight size={14} className="text-neutral-300" />
        <div className="flex flex-col text-right">
          <span className="text-neutral-400 mb-0.5 italic">Balance After</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {settings.currency}
            {transaction.balanceAfter.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
