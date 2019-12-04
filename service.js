var cacheName = 'v1'; 

var cacheFiles = [
  'index.html',
  '/',
]

self.addEventListener('install', function(e) {
    e.waitUntil(
	    caches.open(cacheName).then(function(cache) {
			return cache.addAll(cacheFiles);
	    })
	);
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {
				if (thisCacheName !== cacheName) {
					return caches.delete(thisCacheName);
				}
			}));
		})
	);
});


self.addEventListener('fetch', function(e) {

	e.respondWith(
		caches.match(e.request)
			.then(function(response) {
				if ( response ) {
					return response;
				}

				var requestClone = e.request.clone();
				fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							return response;
						}

						var responseClone = response.clone();

						caches.open(cacheName).then(function(cache) {

							cache.put(e.request, responseClone);
							return response;
			
				        });

					})
					.catch(function(err) {
						console.log('Error Caching New Data', err);
					});
			})
	); 
});