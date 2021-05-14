using System.Collections.Generic;

namespace SmartTutorial.API.Utilities.Filtering
{
    public class Filter
    {
        public string Field { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
        public string Logic { get; set; }
        public IEnumerable<Filter> Filters { get; set; }
    }
}
