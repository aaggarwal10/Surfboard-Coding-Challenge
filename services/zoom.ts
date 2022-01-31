const axios = require('axios');
export default async function MakeZoomCall(meetingTitle: string, startTime: number, endTime: number)
{
    // Make Zoom API call
    const data = {
        meetingTitle,
        startTime,
        endTime
    };
    console.log(new Date(startTime).toISOString());
return axios({
    method: 'post',
    url: "https://daommo.anishaggarwal.ca/zoom/addMeeting",
    data: data,
    headers: {
        "content-type": "application/json"
    },
  })
  .then(function(response) {
    //handle success
    console.log(response.data);
    return response.data.join_url;
  })
  .catch(function(response) {
    //handle error
    console.log(response);
    return "";
  });
   
}