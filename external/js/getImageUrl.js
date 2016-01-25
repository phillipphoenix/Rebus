
/**
* @param {string} searchTerm - Search term for Google Image search.
* @param {function(string,number,number)} callback - Called when an image has
*   been found. The callback gets the URL, width and height of the image.
* @param {function(string)} errorCallback - Called when the image is not found.
*   The callback gets a string that describes the failure reason.
*/
function getImageUrl(searchTerm, callback, errorCallback) {
  var success = false;
  // First try with Google.
  getImageUrlGoogle(searchTerm, function(imageUrl, width, height) {
    success = true;
    callback(imageUrl, width, height);
  },
  function(errorCode, errorMessage) {
    if (errorCode != 403) {
      errorCallback(errorMessage);
    }
  });
  // Second try with Bing.
  getImageUrlBing(searchTerm, function(imageUrl, width, height) {
    success = true;
    callback(imageUrl, width, height);
  },
  function(errorCode, errorMessage) {
    if (errorCode != 403) {
      errorCallback(errorMessage);
    }
  });

  if (!success) {
    // Nothing left to try.
    errorCallback("Network error or quota reached and nothing left to try.");
  }
}

function getImageUrlGoogle(searchTerm, callback, errorCallback) {
  var searchUrl = 'https://www.googleapis.com/customsearch/v1';
  var cleanSearchTerm = encodeURIComponent(searchTerm);
  $.ajax({
    url: searchUrl,
    data: {
      key: 'AIzaSyD5GTKULIsLGKKWNOggVxZXgdYLmNiOq5U',
      q: cleanSearchTerm,
      cx: '014471905706524665151:qfrv9naevqi',
      searchType: "image",
      num: 1
    },
    dataType: "json",
    success: function(data) {
      var item = data.items[0];
      var imageUrl = {"url": item.link, "tbUrl": item.link};
      var width = {"width": parseInt(item.image.width), "tbWidth": parseInt(item.image.width)};
      var height = {"height": parseInt(item.image.height), "tbHeight": parseInt(item.image.height)};

      console.assert(
        typeof imageUrl.url == 'string' && !isNaN(width.width) && !isNaN(height.height),
        'Unexpected respose from the Google Image Search API!');
        callback(imageUrl, width, height);
      },
      error: function(xhr, status, text) {
        errorCallback(xhr.status, "Network error or quota reached.");
      }
    });
  }


  function getImageUrlBing(searchTerm, callback, errorCallback) {
    var cleanSearchTerm = encodeURIComponent(searchTerm);
    $.bingSearch({
      // Required: query text
      query: cleanSearchTerm,
      // Required (unless you use urlBase) by Bing Search API
      appKey: 'Bb69lYNLs3ASp4ZADQPfLGQs1x0fl4FxeKlDifhsPlA',
      // Optional (defaults to the Bing Search API Web Results Query).
      // Additional information: This feature allows you to proxy through a server-side
      //                         script in order to hide your API key, which is exposed to the
      //                         world if you set it client-side in appKey. An example PHP
      //                         script is included (searchproxy.php).
      //urlBase: 'searchproxy.php',
      // Optional (defaults to 1): Page Number
      //pageNumber: parseInt($('#pageNumber').val()),
      // Optional (defaults to 10): Page Size
      pageSize: 10,
      // Optional (defaults to null): Limit to site. Shortcut to adding "site:example.org " to query
      //limitToSite: 'example.org',
      // Optional (defaults to false): Print console logging information about search results
      debug: false,
      // Optional: Function is called after search results are retrieved, but before the interator is called
      beforeSearchResults: function(data) {
        // Use data.hasMore, data.resultBatchCount
      },
      // Optional: Function is called once per result in the current batch
      searchResultIterator: function(data) {
        if (data.MediaUrl == null || data.MediaUrl == '') {
          var imageUrl = {"url": data.ThumbnailUrl, "tbUrl": data.ThumbnailUrl};
          var width = {"width": data.Width, "tbWidth": data.ThumbnailWidth};
          var height = {"height": data.Height, "tbHeight": data.ThumbnailHeight};
        } else {
          var imageUrl = {"url": data.MediaUrl, "tbUrl": data.ThumbnailUrl};
          var width = {"width": data.Width, "tbWidth": data.ThumbnailWidth};
          var height = {"height": data.Height, "tbHeight": data.ThumbnailHeight};
        }
        callback(imageUrl, width, height);
        // Use data.ID, data.Title, data.Description, data.MediaUrl, data.Width, data.Height data.ThumbnailUrl, data.ThumbnailWidth, data.ThumbnailHeight, data.Metadata.Type (check for undefined)
      },
      // Optional: Function is called after search results are retrieved and after all instances of the interator are called
      afterSearchResults: function(data) {
        // Use data.hasMore, data.resultBatchCount
      },
      // Optional: Called when there is an error retrieving results
      fail: function(data) {
        // data contains an error message
        errorCallback(403, "Network error or quota reached.");
      }
    });
  }
