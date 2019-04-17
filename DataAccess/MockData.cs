using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using Models;

namespace DataAccess
{
    public class MockData : IMockData
    {
        const string cs = @"Data Source=localhost\SQLEXPRESS;Initial Catalog=paging-demo;Integrated Security=True;Pooling=False";
      
        public static SqlConnection GetSqlConnection(string cs)
        {
            SqlConnection conn = new SqlConnection(cs);
            conn.Open();
            return conn;
        }

        public async Task<int> GetMockDataCountAsync()
        {
            int count = 0;
            using (SqlConnection conn = GetSqlConnection(cs))
            {
                using (SqlCommand command = conn.CreateCommand())
                {
                    command.CommandText = @"[dbo].[usp_GetMockDataCount]";
                    command.CommandType = CommandType.StoredProcedure;
                 
                    count = (int)await command.ExecuteScalarAsync();
                }
            }
            return count;
        }

        public async Task<PagedList<MockDataDto>> GetMockDataPagedAsync(Page page)
        {
            int mockDataCount = await GetMockDataCountAsync();
            //experimenting with ways to do this
            PagedList<MockDataDto> mockData = PagedList<MockDataDto>.Create(mockDataCount, page.PageNumber, page.PageSize);

            using (SqlConnection conn = GetSqlConnection(cs))
            {
                using (SqlCommand command = conn.CreateCommand())
                {
                    command.CommandText = @"[dbo].[usp_GetDataPaged]";
                    command.CommandType = CommandType.StoredProcedure;
                   

                    SqlParameter _skip = new SqlParameter("@skip", SqlDbType.Int)
                    {
                        Value = mockData.PagedListMetaData.Skip
                    };
                    command.Parameters.Add(_skip);

                    SqlParameter _take = new SqlParameter("@take", SqlDbType.Int)
                    {
                        Value = mockData.PagedListMetaData.Take
                    };
                    command.Parameters.Add(_take);

                    SqlDataReader reader = await command.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                    while (await reader.ReadAsync())
                    {//[id], [first_name], [last_name], [gender], [ip_address] 
                        MockDataDto md = new MockDataDto
                        {
                            Id = int.Parse(reader["id"].ToString()),
                            FirstName = reader["first_name"].ToString(),
                            LastName = reader["last_name"].ToString(),
                            Email = reader["email"].ToString(),
                            Gender = reader["gender"].ToString(),
                            IpAddress = reader["ip_address"].ToString(),
                        };

                        mockData.Add(md);
                    }
                }
            }

            return mockData;
        }
    }
}
