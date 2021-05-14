using SmartTutorial.API.Utilities.Filtering;
using SmartTutorial.API.Utilities.Sorting;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.PaginationDtos
{
    public abstract class PaginationParameter
    {
        private const int MaxPageSize = 50;

        public int PageNumber { get; set; } = 1;

        public IEnumerable<Sort> Sort { get; set; }
        public Filter Filter { get; set; }

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}
