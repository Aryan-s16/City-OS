"use client";

import { forwardRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input, type InputProps } from "./Input";

/** Search input — Input preset with a leading search glyph. */
export const Search = forwardRef<HTMLInputElement, Omit<InputProps, "leftIcon">>(
  ({ placeholder = "Search…", type = "search", ...props }, ref) => (
    <Input
      ref={ref}
      type={type}
      placeholder={placeholder}
      leftIcon={SearchIcon}
      {...props}
    />
  )
);

Search.displayName = "Search";
