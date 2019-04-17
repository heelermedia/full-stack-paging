using Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public interface IMockData
    {
        Task<int> GetMockDataCountAsync();
        Task<PagedList<MockDataDto>> GetMockDataPagedAsync(Page page);
    }
}
