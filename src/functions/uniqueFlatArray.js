'use strict'
module.exports = function(arr)
{
	const n = {},r=[]
  const len = arr.length
	for(let i = 0; i < arr.length; i++) 
	{
		if (!n[arr[i]]) 
		{
			n[arr[i]] = true
			r.push(arr[i])
		}
	}
	return r
}
