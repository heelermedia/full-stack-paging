CREATE PROCEDURE [dbo].[usp_GetDataPaged]
	@skip INT,
	@take INT
AS
BEGIN
	SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

	SELECT [id], [first_name], [last_name], [email], [gender], [ip_address] 
	FROM [dbo].[MOCK_DATA] 
	ORDER BY [first_name], [last_name]
	OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY
END
