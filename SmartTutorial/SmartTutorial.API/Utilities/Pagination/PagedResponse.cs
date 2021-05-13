using System.Collections.Generic;

namespace SmartTutorial.API.Utilities.Pagination
{
    public class PagedResponse<T> where T : class
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
