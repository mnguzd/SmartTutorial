using System;
using System.Collections.Generic;

namespace SmartTutorial.Domain
{
    public class Subject:BaseEntity
    {
        public Subject()
        {
            Topics = new List<Topic>();
        }
        public string Name { get; set; }
        public int Complexity { get; set; }
        public DateTime Date { get; set; }
        public virtual List<Topic> Topics { get; set; }

        public virtual int ThemeId { get; set; }
        public virtual Theme Theme { get; set; }
    }
}
