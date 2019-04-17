namespace Models
{
    /// <summary>
    /// 
    /// </summary>
    public class PagedListMetaData
    {
        /// <summary>
        /// 
        /// </summary>
        public int CurrentPage { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int TotalPages { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int TotalCount { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int Skip { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int Take { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool HasPrevious
        {
            get
            {
                return (CurrentPage > 1);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public bool HasNext
        {
            get
            {
                return (CurrentPage < TotalPages);
            }
        }
    }
}