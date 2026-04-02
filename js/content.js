document.addEventListener("DOMContentLoaded", function () {

  var contentPromise = fetch("data/content.json").then(function (r) { return r.json(); });
  var assetsPromise  = fetch("data/assets.json").then(function (r)  { return r.json(); });

  Promise.all([contentPromise, assetsPromise])
    .then(function (results) {
      var content = results[0];
      var assets  = results[1];

      /* Hero background */
      var hero = document.querySelector(".hero");
      if (hero && assets.hero && assets.hero.background) {
        hero.style.backgroundImage = "url('" + assets.hero.background + "')";
      }

      /* Hero text */
      var heroLabel    = document.getElementById("hero-label");
      var heroSubtitle = document.getElementById("hero-subtitle");
      var heroCta      = document.getElementById("hero-cta");

      if (heroLabel    && content.hero) heroLabel.textContent    = content.hero.label;
      if (heroSubtitle && content.hero) heroSubtitle.textContent = content.hero.subtitle;
      if (heroCta      && content.hero) {
        heroCta.textContent = content.hero.cta_label;
        heroCta.setAttribute("href", content.hero.cta_href);
      }

      /* About section */
      var aboutBadgeTitle = document.getElementById("about-badge-title");
      var aboutBadgeSub   = document.getElementById("about-badge-sub");
      var aboutHeading    = document.getElementById("about-heading");
      var aboutText       = document.getElementById("about-text");
      var aboutImage      = document.getElementById("about-image");

      if (content.about) {
        if (aboutBadgeTitle) aboutBadgeTitle.textContent = content.about.badge_title;
        if (aboutBadgeSub)   aboutBadgeSub.textContent   = content.about.badge_sub;
        if (aboutHeading)    aboutHeading.textContent     = content.about.heading;
        if (aboutText)       aboutText.textContent        = content.about.text;
      }
      if (aboutImage && assets.about && assets.about.below_image) {
        aboutImage.src = assets.about.below_image;
      }

      /* Why Join Us section */
      if (content.why_join) {
        var wjHeading = document.getElementById("wj-heading");
        var wjSub     = document.getElementById("wj-sub");
        if (wjHeading) wjHeading.textContent = content.why_join.heading;
        if (wjSub)     wjSub.textContent     = content.why_join.subtitle;
      }
      if (assets.why_join) {
        var wjMap = { "wj-l1": "L1", "wj-l2": "L2", "wj-l3": "L3", "wj-l4": "L4", "wj-r1": "R1" };
        Object.keys(wjMap).forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.src = assets.why_join[wjMap[id]];
        });
      }

      /* Gallery */
      if (content.gallery) {
        var galHeading     = document.getElementById("gallery-heading");
        var galSanskrit    = document.getElementById("gallery-sanskrit");
        var galTranslation = document.getElementById("gallery-translation");
        if (galHeading)     galHeading.textContent     = content.gallery.badge_heading;
        if (galSanskrit)    galSanskrit.textContent    = content.gallery.badge_sanskrit;
        if (galTranslation) galTranslation.textContent = content.gallery.badge_roman;
      }
      if (assets.gallery) {
        var galleryGrid = document.getElementById("gallery-grid");
        if (galleryGrid) {
          /* moments_bg used as grid background panel — not a tile */
          if (assets.gallery.moments_bg) {
            galleryGrid.style.backgroundImage = "url('" + assets.gallery.moments_bg + "')";
          }
          var galleryKeys = Object.keys(assets.gallery).filter(function (k) { return k !== 'moments_bg'; });
          galleryGrid.innerHTML = galleryKeys.map(function (key) {
            return '<img class="gallery-img" src="' + assets.gallery[key] + '" alt="' + key.replace(/_/g, ' ') + '">';
          }).join('');
        }
      }

      /* Path of Practice — carousel */
      var classesHeading  = document.getElementById("classes-heading");
      var classesCarousel = document.getElementById("classes-carousel");

      if (classesHeading && content.classes) {
        classesHeading.textContent = content.classes.badge_heading;
      }

      if (classesCarousel && content.classes && content.classes.items && assets.classes) {
        classesCarousel.innerHTML = content.classes.items.map(function (item) {
          var src = assets.classes[item.key] || '';
          return '<div class="class-card">'
            + '<img src="' + src + '" alt="' + item.name + '">'
            + '<span class="class-label">' + item.name + '</span>'
            + '<div class="class-hover">'
            +   '<span class="class-hover-name">'    + item.name      + '</span>'
            +   '<span class="class-hover-timings">' + item.timings   + '</span>'
            +   '<span class="class-hover-fees">'    + item.fees      + '</span>'
            +   '<a href="' + item.cta_href + '" class="class-hover-cta">' + item.cta_label + '</a>'
            + '</div>'
            + '</div>';
        }).join('');
      }

      /* Carousel prev / next */
      var carouselTrack = document.getElementById("classes-carousel");
      var prevBtn       = document.getElementById("classes-prev");
      var nextBtn       = document.getElementById("classes-next");
      if (carouselTrack && prevBtn && nextBtn) {
        var cardWidth = 210 + 20;   /* card width + gap */
        prevBtn.addEventListener("click", function () {
          carouselTrack.scrollBy({ left: -cardWidth, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", function () {
          carouselTrack.scrollBy({ left: cardWidth, behavior: "smooth" });
        });
      }

      /* Instructor section */
      if (content.instructor) {
        var instHeading = document.getElementById("instructor-heading");
        var instBio     = document.getElementById("instructor-bio");
        var instQuoteLine1 = document.getElementById("instructor-quote-line1");
        var instQuoteLine2 = document.getElementById("instructor-quote-line2");
        if (instHeading)    instHeading.textContent    = content.instructor.badge_heading;
        if (instBio)        instBio.textContent        = content.instructor.bio;
        if (instQuoteLine1) instQuoteLine1.textContent = content.instructor.quote_line1;
        if (instQuoteLine2) instQuoteLine2.textContent = content.instructor.quote_line2;
      }
      if (assets.instructor) {
        var instPhoto  = document.getElementById("instructor-photo");
        var instAction = document.getElementById("instructor-action");
        if (instPhoto  && assets.instructor.photo)  instPhoto.src  = assets.instructor.photo;
        if (instAction && assets.instructor.action) instAction.src = assets.instructor.action;
      }

      /* Testimonials section */
      var testimonialsHeading  = document.getElementById("testimonials-heading");
      var testimonialsCarousel = document.getElementById("testimonials-carousel");

      if (testimonialsHeading && content.testimonials) {
        testimonialsHeading.textContent = content.testimonials.badge_heading;
      }

      if (testimonialsCarousel && content.testimonials && content.testimonials.items) {
        testimonialsCarousel.innerHTML = content.testimonials.items.map(function (item) {
          return '<div class="testimonial-card">'
            + '<span class="testimonial-quote">' + item.quote + '</span>'
            + '<span class="testimonial-name">'  + item.name  + '</span>'
            + '<span class="testimonial-since">' + item.since + '</span>'
            + '</div>';
        }).join('');
      }

      /* Testimonials carousel prev / next */
      var testTrack   = document.getElementById("testimonials-carousel");
      var testPrevBtn = document.getElementById("testimonials-prev");
      var testNextBtn = document.getElementById("testimonials-next");
      if (testTrack && testPrevBtn && testNextBtn) {
        var testCardWidth = 280 + 28;   /* card width + gap */
        testPrevBtn.addEventListener("click", function () {
          testTrack.scrollBy({ left: -testCardWidth, behavior: "smooth" });
        });
        testNextBtn.addEventListener("click", function () {
          testTrack.scrollBy({ left: testCardWidth, behavior: "smooth" });
        });
      }

      /* Contact boxes */
      if (content.contact) {
        /* Text box */
        var contactTextBox = document.getElementById("contact-text-box");
        if (contactTextBox && content.contact.text) {
          var ct = content.contact.text;
          contactTextBox.innerHTML =
            '<span class="contact-box-heading">' + ct.heading + '</span>'
            + '<span class="contact-box-body">' + ct.body + '</span>';
        }

        /* WhatsApp box */
        var contactWaBox = document.getElementById("contact-wa-box");
        if (contactWaBox && content.contact.whatsapp) {
          var wa = content.contact.whatsapp;
          var waIconSrc = (assets.contact && assets.contact.wa_icon) ? assets.contact.wa_icon : '';
          contactWaBox.href = "https://wa.me/" + wa.number + "?text=" + encodeURIComponent(wa.message);
          contactWaBox.innerHTML =
            '<img class="contact-box-icon-img" src="' + waIconSrc + '" alt="WhatsApp">'
            + '<span class="contact-box-label">' + wa.label + '</span>'
            + '<span class="contact-box-sub">'   + wa.sub   + '</span>'
            + '<span class="contact-box-cta">'   + wa.cta   + ' →</span>';
        }

        /* Instagram box */
        var contactIgBox = document.getElementById("contact-ig-box");
        if (contactIgBox && content.contact.instagram) {
          var ig = content.contact.instagram;
          var igIconSrc = (assets.contact && assets.contact.ig_icon) ? assets.contact.ig_icon : '';
          contactIgBox.href = ig.url;
          contactIgBox.innerHTML =
            '<img class="contact-box-icon-img" src="' + igIconSrc + '" alt="Instagram">'
            + '<span class="contact-box-label">' + ig.handle + '</span>'
            + '<span class="contact-box-sub">'   + ig.sub    + '</span>'
            + '<span class="contact-box-cta">'   + ig.cta    + ' →</span>';
        }
      }

      /* Nav links */
      var navLinks = document.getElementById("nav-links");
      if (navLinks && content.navbar && content.navbar.links) {
        navLinks.innerHTML = content.navbar.links.map(function (link) {
          var cls = link.label === "Join Now" ? ' class="nav-join"' : '';
          return '<a href="' + link.href + '"' + cls + '>' + link.label + '</a>';
        }).join("");
      }
    })
    .catch(function (err) {
      console.error("Content load error:", err);
    });

});
