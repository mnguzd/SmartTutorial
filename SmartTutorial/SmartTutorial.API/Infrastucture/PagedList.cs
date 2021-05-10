using System.Collections.Generic;
using System.Linq;

namespace SmartTutorial.API.Infrastucture
{
    public class PagedList<T> : List<T>
    {
        public int TotalCount { get; }

        private PagedList(IEnumerable<T> items, int count)
        {
            TotalCount = count;
            AddRange(items);
        }
        public static PagedList<T> ToPagedList(IList<T> source, int pageNumber, int pageSize)
        {
            var count = source.Count();
            var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PagedList<T>(items, count);
        }
    }
}
