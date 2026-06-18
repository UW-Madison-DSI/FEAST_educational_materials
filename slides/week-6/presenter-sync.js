/**
 * presenter-sync.js — bridges BroadcastChannel to deck-stage navigation.
 *
 * When loaded in the deck, it:
 *  1. Listens for {type:'goTo', index} on the channel and calls deck.goTo(i)
 *  2. Listens for deck slidechange events and posts {type:'slideChanged', index} back
 *
 * This lets the presenter.html drive the deck and stay in sync if someone
 * navigates directly in the audience window.
 */
(function() {
  // Skip in preview iframes (presenter.html loads them with ?preview=1)
  if (location.search.indexOf('preview') !== -1) return;

  var CHANNEL_NAME = 'feast-deck-sync';
  var channel;
  try { channel = new BroadcastChannel(CHANNEL_NAME); } catch(e) { return; }

  var deck = document.querySelector('deck-stage');
  if (!deck) return;

  var suppressing = false;

  channel.onmessage = function(e) {
    if (e.data && e.data.type === 'goTo' && typeof e.data.index === 'number') {
      suppressing = true;
      deck.goTo(e.data.index);
      suppressing = false;
    }
  };

  deck.addEventListener('slidechange', function(e) {
    if (suppressing) return;
    channel.postMessage({ type: 'slideChanged', index: e.detail.index });
  });
})();
