import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, Box, InputLabel, FormControl } from '@mui/material';

const FilterComponent = ({ items, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const uniqueCategories = Array.from(new Set(items.map(item => item.Category?.name))).filter(Boolean);
        setCategories(uniqueCategories);
        console.log('these are unique categories ',uniqueCategories)
    }, [items]);

    useEffect(() => {
        const uniqueSubcategories = selectedCategory
            ? Array.from(new Set(items
                .filter(item => item.Category?.name === selectedCategory)
                .map(item => item.SubCategory?.name))).filter(Boolean)
            : [];
        setSubcategories(uniqueSubcategories);
        console.log('these are sucategrries',uniqueSubcategories)
        
    }, [selectedCategory, items]);

    const applyFiltersAndSort = () => {
        let filteredItems = items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory ? item.Category?.name === selectedCategory : true;
            const matchesSubcategory = selectedSubcategory ? item.SubCategory?.name === selectedSubcategory : true;

            return matchesSearch && matchesCategory && matchesSubcategory;
        });

        // Sorting logic
        if (sortOption) {
            filteredItems.sort((a, b) => {
                switch (sortOption) {
                    case 'createdDate':
                        return new Date(b.createdAt) - new Date(a.createdAt); // Latest first
                    case 'isFeatured':
                        return (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? 1 : -1; // Featured first
                    case 'priceLowToHigh':
                        return a.price - b.price;
                    case 'priceHighToLow':
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
        }

        onFilterChange(filteredItems);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubcategory('');
        applyFiltersAndSort();
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
        applyFiltersAndSort();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        applyFiltersAndSort();
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        applyFiltersAndSort();
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={handleCategoryChange}>
                    <MenuItem value="">
                        <em>All Categories</em>
                    </MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory}>
                    <MenuItem value="">
                        <em>All Subcategories</em>
                    </MenuItem>
                    {subcategories.map(subcategory => (
                        <MenuItem key={subcategory} value={subcategory}>
                            {subcategory}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortOption} onChange={handleSortChange}>
                    <MenuItem value="">
                        <em>Default</em>
                    </MenuItem>
                    <MenuItem value="createdDate">Created Date</MenuItem>
                    <MenuItem value="isFeatured">Featured</MenuItem>
                    <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                    <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default FilterComponent;
