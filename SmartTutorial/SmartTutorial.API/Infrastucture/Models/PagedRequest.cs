using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Infrastucture.Models
{
    public class PagedRequest
    {
        public PagedRequest()
        {
            RequestFilters = new RequestFilters();
        }
        [Required]
        public int PageIndex { get; set; }
        [Required]
        public int PageSize { get; set; }

        public string ColumnNameForSorting { get; set; }

        public string SortDirection { get; set; }

        public RequestFilters RequestFilters { get; set; }
    }
}
