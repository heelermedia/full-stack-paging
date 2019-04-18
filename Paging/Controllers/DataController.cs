using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;

namespace Paging.Controllers
{
    [Route("api/data")]
    //[ApiController]
    public class DataController : ControllerBase
    {
        private IMockData _mockData;
        public DataController(IMockData mockData)
        {
            _mockData = mockData;
        }

        [HttpGet]
        public async Task<ActionResult<List<MockDataDto>>> GetMockData(Page page)
        {
            PagedList<MockDataDto> mockData = await _mockData.GetMockDataPagedAsync(page);
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(mockData.PagedListMetaData));
            return Ok(mockData);
        }
    }
}
