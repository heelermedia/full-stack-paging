using System;
using System.Collections.Generic;
using System.Text;

namespace Models
{   
    public class PagedList<T> : List<T>
    {
        public PagedListMetaData PagedListMetaData { get; private set; }
       
        public PagedList(int count, int pageNumber, int pageSize)
        {
            this.PagedListMetaData = new PagedListMetaData()
            {
                Skip = (pageNumber - 1) * pageSize,
                Take = pageSize,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalCount = count,
                //if there are 101 records with a page size of 10 this will return 11
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };

        }
      
        public static PagedList<T> Create(int count, int pageNumber, int pageSize)
        {
            return new PagedList<T>(count, pageNumber, pageSize);
        }
    }
}
