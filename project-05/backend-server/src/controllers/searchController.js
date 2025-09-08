const searchService = require("../services/searchService");
const { BaseResponseDto } = require("../dto/responseDto");

class SearchController {
  /**
   * Advanced product search
   * GET /v1/api/products/search?query=iphone&categoryId=123&minPrice=100&maxPrice=1000&rating=4&minReviewCount=10&inStock=true&hasDiscount=true&brand=apple&sortBy=price&sortOrder=asc&limit=20&offset=0
   */
  async searchProducts(req, res) {
    try {
      const {
        query,
        categoryId,
        minPrice,
        maxPrice,
        rating,
        minReviewCount,
        inStock,
        hasDiscount,
        brand,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = req.query;

      // Validate and sanitize parameters
      const searchParams = {
        query: query ? query.toString().trim() : "",
        categoryId: categoryId ? categoryId.toString() : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        rating: rating ? parseFloat(rating) : undefined,
        minReviewCount: minReviewCount ? parseInt(minReviewCount) : undefined,
        inStock: inStock ? inStock.toString() : undefined,
        hasDiscount: hasDiscount ? hasDiscount.toString() : undefined,
        brand: brand ? brand.toString() : undefined,
        sortBy: sortBy ? sortBy.toString() : "relevance",
        sortOrder: ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc",
        limit: limit ? Math.min(parseInt(limit), 100) : 20, // Max 100 per request
        offset: offset ? Math.max(parseInt(offset), 0) : 0,
      };

      // Validate price range
      if (
        searchParams.minPrice !== undefined &&
        searchParams.maxPrice !== undefined
      ) {
        if (searchParams.minPrice > searchParams.maxPrice) {
          return res
            .status(400)
            .json(
              BaseResponseDto.error("minPrice cannot be greater than maxPrice")
            );
        }
      }

      // Validate rating range
      if (searchParams.rating !== undefined) {
        if (searchParams.rating < 0 || searchParams.rating > 5) {
          return res
            .status(400)
            .json(BaseResponseDto.error("rating must be between 0 and 5"));
        }
      }

      // Validate minReviewCount
      if (searchParams.minReviewCount !== undefined) {
        if (searchParams.minReviewCount < 0) {
          return res
            .status(400)
            .json(
              BaseResponseDto.error(
                "minReviewCount must be greater than or equal to 0"
              )
            );
        }
      }

      const result = await searchService.searchProducts(searchParams);

      if (result.success) {
        // Add search metadata to response headers for analytics
        res.set({
          "X-Search-Query": searchParams.query || "none",
          "X-Search-Results": result.meta?.totalItems || 0,
          "X-Search-Time": result.meta?.searchTime || "N/A",
        });

        return res.status(200).json(result);
      } else {
        return res.status(500).json(result);
      }
    } catch (error) {
      console.error("❌ Search controller error:", error);
      return res
        .status(500)
        .json(BaseResponseDto.error("Search service temporarily unavailable"));
    }
  }

  /**
   * Get search suggestions/autocomplete
   * GET /v1/api/search/suggestions?query=iph&limit=10
   */
  async getSearchSuggestions(req, res) {
    try {
      const { query, limit } = req.query;

      if (!query || query.toString().trim().length < 2) {
        return res
          .status(400)
          .json(
            BaseResponseDto.error("Query must be at least 2 characters long")
          );
      }

      const suggestionLimit = limit ? Math.min(parseInt(limit), 20) : 10;

      const result = await searchService.getSearchSuggestions(
        query.toString().trim(),
        suggestionLimit
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Suggestions controller error:", error);
      return res
        .status(500)
        .json(
          BaseResponseDto.error("Suggestions service temporarily unavailable")
        );
    }
  }

  /**
   * Get available search filters
   * GET /v1/api/search/filters?categoryId=123
   */
  async getSearchFilters(req, res) {
    try {
      const { categoryId } = req.query;

      const result = await searchService.getSearchFilters(categoryId);

      if (result.success) {
        // Cache filters for 5 minutes
        res.set({
          "Cache-Control": "public, max-age=300",
          "X-Cache-Strategy": "filters",
        });

        return res.status(200).json(result);
      } else {
        return res.status(500).json(result);
      }
    } catch (error) {
      console.error("❌ Filters controller error:", error);
      return res
        .status(500)
        .json(BaseResponseDto.error("Filters service temporarily unavailable"));
    }
  }

  /**
   * Popular search terms
   * GET /v1/api/search/popular
   */
  async getPopularSearchTerms(req, res) {
    try {
      // This would typically come from analytics/search logs
      const popularTerms = [
        { term: "iPhone", count: 1250, category: "Electronics" },
        { term: "MacBook", count: 890, category: "Electronics" },
        { term: "Nike", count: 678, category: "Clothing" },
        { term: "JavaScript", count: 456, category: "Books" },
        { term: "Coffee Maker", count: 334, category: "Home & Garden" },
        { term: "Basketball", count: 234, category: "Sports" },
        { term: "Samsung", count: 789, category: "Electronics" },
        { term: "Adidas", count: 567, category: "Clothing" },
        { term: "Python", count: 445, category: "Books" },
        { term: "Yoga Mat", count: 223, category: "Sports" },
      ];

      const meta = {
        totalTerms: popularTerms.length,
        itemCount: popularTerms.length,
        itemsPerPage: popularTerms.length,
        totalPages: 1,
        currentPage: 1,
        updatedAt: new Date().toISOString(),
      };

      // Cache popular terms for 1 hour
      res.set({
        "Cache-Control": "public, max-age=3600",
        "X-Cache-Strategy": "popular-terms",
      });

      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        data: popularTerms,
        meta,
      });
    } catch (error) {
      console.error("❌ Popular terms controller error:", error);
      return res
        .status(500)
        .json(
          BaseResponseDto.error("Popular terms service temporarily unavailable")
        );
    }
  }

  /**
   * Search analytics endpoint (for admin/debugging)
   * GET /v1/api/search/analytics
   */
  async getSearchAnalytics(req, res) {
    try {
      // This would typically require admin authentication
      const analytics = {
        totalSearches: 15420,
        uniqueQueries: 3450,
        averageResultsPerSearch: 23.5,
        topCategories: [
          { name: "Electronics", searchCount: 5420, conversionRate: 0.15 },
          { name: "Clothing", searchCount: 3890, conversionRate: 0.12 },
          { name: "Books", searchCount: 2340, conversionRate: 0.18 },
          { name: "Home & Garden", searchCount: 2110, conversionRate: 0.14 },
          { name: "Sports", searchCount: 1660, conversionRate: 0.16 },
        ],
        searchTrends: {
          today: 456,
          thisWeek: 2340,
          thisMonth: 8920,
          growth: "+12.5%",
        },
        performance: {
          averageSearchTime: "45ms",
          elasticsearchUptime: "99.8%",
          cacheHitRate: "78%",
        },
      };

      const meta = {
        reportGeneratedAt: new Date().toISOString(),
        reportPeriod: "last_30_days",
        dataSource: "elasticsearch_logs",
      };

      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        data: analytics,
        meta,
      });
    } catch (error) {
      console.error("❌ Analytics controller error:", error);
      return res
        .status(500)
        .json(
          BaseResponseDto.error("Analytics service temporarily unavailable")
        );
    }
  }
}

module.exports = new SearchController();
