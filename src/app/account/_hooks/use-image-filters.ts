import {  ViewMode } from "@/@types";
import { useState } from "react";
import { FileType, SortType } from "../_components/select-options";

export function useImageFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortType>("date-desc");
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType[]>(["images"]);
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [usageFilter, setUsageFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
 

  return {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    fileTypeFilter,
    setFileTypeFilter,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    usageFilter,
    setUsageFilter,
    openFilter,
    setOpenFilter,
  };
}
