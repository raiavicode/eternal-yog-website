(function () {

  /* Read ?class= from URL — e.g. html/join.html?class=power_yoga */
  var params   = new URLSearchParams(window.location.search);
  var classKey = params.get('class');

  Promise.all([
    fetch('../data/content.json').then(function (r) { return r.json(); }),
    fetch('../data/assets.json').then(function (r)  { return r.json(); }),
    fetch('../data/plans.json').then(function (r)   { return r.json(); })
  ]).then(function (results) {

    var content   = results[0];
    var assets    = results[1];
    var plansData = results[2];

    var classPicker   = document.getElementById('class-picker');
    var classHero     = document.getElementById('class-hero');
    var plansSection  = document.getElementById('plans-section');
    var payBtn        = document.getElementById('payBtn');

    /* ── NO CLASS PARAM — show class picker ── */
    if (!classKey) {
      classHero.style.display    = 'none';
      plansSection.style.display = 'none';
      payBtn.style.display       = 'none';

      var classGrid = document.getElementById('class-grid');
      if (classGrid && content.classes && content.classes.items) {
        var items = content.classes.items;

        /* Wrap grid in carousel container */
        var wrap = document.createElement('div');
        wrap.className = 'j-carousel-wrap';
        classGrid.parentNode.insertBefore(wrap, classGrid);
        wrap.appendChild(classGrid);

        items.forEach(function (item) {
          var imgSrc = (assets.classes && assets.classes[item.key])
            ? '../' + assets.classes[item.key]
            : '';

          var card = document.createElement('div');
          card.className = 'j-picker-card';
          card.innerHTML =
            '<img class="j-picker-card-img" src="' + imgSrc + '" alt="' + item.name + '">'
            + '<div class="j-picker-card-overlay"></div>'
            + '<div class="j-picker-card-info">'
            +   '<p class="j-picker-card-name">'    + item.name    + '</p>'
            +   '<p class="j-picker-card-timings">' + item.timings + '</p>'
            + '</div>';

          card.onclick = function () {
            window.location.href = 'join.html?class=' + encodeURIComponent(item.key);
          };

          classGrid.appendChild(card);
        });

        /* Dot indicators — only rendered on mobile/tablet */
        if (window.matchMedia('(max-width: 1024px)').matches) {
          var dotsEl = document.createElement('div');
          dotsEl.className = 'j-carousel-dots';

          var dots = items.map(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'j-carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.onclick = function () {
              var cards = classGrid.querySelectorAll('.j-picker-card');
              if (cards[i]) {
                classGrid.scrollTo({ left: cards[i].offsetLeft - 24, behavior: 'smooth' });
              }
            };
            dotsEl.appendChild(dot);
            return dot;
          });

          wrap.appendChild(dotsEl);

          /* Update active dot on scroll */
          classGrid.addEventListener('scroll', function () {
            var cards = classGrid.querySelectorAll('.j-picker-card');
            var scrollLeft = classGrid.scrollLeft;
            var closest = 0;
            var minDist = Infinity;
            cards.forEach(function (card, i) {
              var dist = Math.abs(card.offsetLeft - 24 - scrollLeft);
              if (dist < minDist) { minDist = dist; closest = i; }
            });
            dots.forEach(function (d, i) {
              d.classList.toggle('active', i === closest);
            });
          });
        }
      }
      return;   /* nothing else to render */
    }

    /* ── CLASS PARAM PRESENT — hide picker, show hero + plans ── */
    classPicker.style.display = 'none';

    /* Pick the plan set for the selected class, fall back to default */
    var plans = plansData[classKey] || plansData['default'] || [];

    /* ── CLASS HERO ── */

    /* Find matching class item from content.json */
    var classItem = null;
    if (content.classes && content.classes.items) {
      classItem = content.classes.items.find(function (item) {
        return item.key === classKey;
      });
    }

    var classNameEl  = document.getElementById('class-name');
    var classTimings = document.getElementById('class-timings');
    var classFeesEl  = document.getElementById('class-fees');

    if (classItem) {
      document.title = classItem.name + ' | Eternal Yog';
      if (classNameEl)  classNameEl.textContent  = classItem.name;
      if (classTimings) classTimings.textContent = classItem.timings;
      if (classFeesEl)  classFeesEl.textContent  = classItem.fees;
      /* Set img src — paths in assets.json are root-relative; prepend ../ from html/ */
      var heroImg = document.getElementById('class-hero-img');
      if (heroImg && assets.classes && assets.classes[classItem.key]) {
        heroImg.src = '../' + assets.classes[classItem.key];
        heroImg.alt = classItem.name;
      }
    } else {
      if (classNameEl) classNameEl.textContent = 'Join Eternal Yog';
    }

    /* ── PLAN SELECTION ── */

    var container    = document.getElementById('plans-container');
    var details      = document.getElementById('plan-details');
    var payBtn       = document.getElementById('payBtn');
    var selectedPlan = null;

    /* WhatsApp number from content.json so it stays configurable */
    var waNumber = (content.contact && content.contact.whatsapp)
      ? content.contact.whatsapp.number
      : '919876543210';

    plans.forEach(function (plan) {
      var card = document.createElement('div');
      card.className = 'plan-card';
      card.innerHTML =
        '<h3>'                                 + plan.name        + '</h3>'
        + '<p class="plan-price">'             + plan.price       + '</p>'
        + '<p class="plan-desc">'              + plan.description + '</p>';

      card.onclick = function () {
        document.querySelectorAll('.plan-card').forEach(function (c) {
          c.classList.remove('active');
        });
        card.classList.add('active');
        selectedPlan = plan;

        /* Summary table — left column */
        details.classList.remove('hidden');
        details.innerHTML =
          '<table class="plan-table">'
          + '<tr><td>Plan</td><td>'      + plan.name        + '</td></tr>'
          + '<tr><td>Price</td><td>'     + plan.price       + '</td></tr>'
          + '<tr><td>Duration</td><td>'  + plan.duration    + '</td></tr>'
          + '<tr><td>Frequency</td><td>' + plan.frequency   + '</td></tr>'
          + '<tr><td>Details</td><td>'   + plan.description + '</td></tr>'
          + '</table>';

        payBtn.classList.remove('hidden');

        /* Split layout — slide in right panel */
        var plansSection  = document.getElementById('plans-section');
        var detailPanel   = document.getElementById('plan-detail-panel');
        plansSection.classList.add('plan-selected');

        /* Right panel — detailed plan info from plans.json */
        var expectItems = (plan.what_to_expect || []).map(function (item) {
          return '<li>' + item + '</li>';
        }).join('');

        var includeTags = (plan.includes || []).map(function (item) {
          return '<span class="j-detail-tag">' + item + '</span>';
        }).join('');

        detailPanel.innerHTML =
          '<div class="j-detail-inner">'
          + '<h2 class="j-detail-plan-name">'   + plan.name                          + '</h2>'
          + '<p  class="j-detail-ideal-for">'   + (plan.ideal_for || '')             + '</p>'
          + '<div>'
          +   '<p class="j-detail-section-title">What to Expect</p>'
          +   '<ul class="j-detail-list">' + expectItems + '</ul>'
          + '</div>'
          + '<div>'
          +   '<p class="j-detail-section-title">Includes</p>'
          +   '<div class="j-detail-tags">' + includeTags + '</div>'
          + '</div>'
          + '</div>';
      };

      container.appendChild(card);
    });

    /* WhatsApp CTA — pre-fills class name + plan name */
    payBtn.onclick = function () {
      if (!selectedPlan) return;
      var cn      = classItem ? classItem.name : 'Eternal Yog';
      var message = "Hi! I'd like to enrol in " + cn + " — " + selectedPlan.name + ". Please share the details.";
      window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message));
    };

  }).catch(function (err) {
    console.error('Join page load error:', err);
  });

})();
