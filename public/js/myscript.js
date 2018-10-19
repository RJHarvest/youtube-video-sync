$(function(){
  $('#usernameForm').on('submit', function(e){
    e.preventDefault();
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodedURIComponent($('#search').val()).replace(/%20/g, "+"),
      maxResults: 10,
      order: "viewCount"
    });

    request.execute(function(response){
      var results = response.result;
      $.each(results.items, function(index, item){
        $.get('tpl/item.html', function(data){
          $('#search-container').append(data);
        });

      });
    });
  });
});

function init(){
  gapi.client.setApiKey("AIzaSyApaJRHakocF7IFElzuams4u1AkoM3jIA0");
  gapi.client.load('youtube', 'v3', function(){
    // yt api is ready
  });
}
