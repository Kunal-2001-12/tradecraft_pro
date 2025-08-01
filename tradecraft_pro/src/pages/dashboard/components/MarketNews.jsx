import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketNews } from '../../../store/slices/marketDataSlice';
import Icon from '../../../components/AppIcon';

const MarketNews = () => {
  const dispatch = useDispatch();
  const { news, loading } = useSelector((state) => state.marketData);

  useEffect(() => {
    dispatch(fetchMarketNews({ limit: 10 }));
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading.news) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Market News</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Newspaper" size={32} className="mx-auto mb-2 opacity-50" />
          <p>No news available</p>
          <p className="text-sm">Market news will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.slice(0, 5).map((article, index) => (
            <div
              key={article.id || index}
              className="group cursor-pointer"
              onClick={() => window.open(article.url, '_blank')}
            >
              <div className="flex space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {article.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.image}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.headline}
                  </h3>
                  
                  {article.summary && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {truncateText(article.summary)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{formatDate(article.datetime)}</span>
                    </div>
                    
                    {article.related && article.related.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {article.related.slice(0, 3).map((symbol, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Icon 
                    name="ExternalLink" 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary transition-colors" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* News Categories */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {['General', 'Earnings', 'IPO', 'Mergers', 'Crypto'].map((category) => (
            <button
              key={category}
              className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketNews;