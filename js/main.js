(function(){
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ===================================================
     DATA
     =================================================== */
  var projects = [
    {
      id: "b", name: "Projeto B", tag: "Residencial",
      location: "Condomínio Conviver Life — Juazeiro do Norte, CE",
      featured: true,
      images: ["projB_collage2", "projB_cover", "projB_1", "projB_collage1", "projB_collage3"]
    },
    {
      id: "a", name: "Projeto A", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projA_cover", "projA_1", "projA_thumb"]
    },
    {
      id: "c", name: "Projeto C", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projC_cover", "projC_1", "projC_pool"]
    },
    {
      id: "d", name: "Projeto D", tag: "Residencial",
      location: "Juazeiro do Norte, CE",
      images: ["projD_1", "projD_2", "projD_3"]
    },
    {
      id: "f", name: "Projeto F", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projF_cover", "projF_1", "projF_2", "projF_pool"]
    },
    {
      id: "g", name: "Projeto G", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projG_cover", "projG_1", "projG_2"]
    },
    {
      id: "h", name: "Projeto H", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projH_1", "projH_2"]
    },
    {
      id: "i", name: "Projeto I", tag: "Residencial",
      location: "Condomínio Le Jardin — Juazeiro do Norte, CE",
      images: ["projI_1"]
    },
    {
      id: "j", name: "Projeto J", tag: "Residencial",
      location: "Araripina, PE",
      images: ["projJ_cover", "projJ_1"]
    },
    {
      id: "l", name: "Projeto L", tag: "Residencial",
      location: "Condomínio Cidade Kariris — Juazeiro do Norte, CE",
      images: ["projL_1", "projL_2", "projL_3", "projL_4"]
    },
    {
      id: "mall", name: "Open Mall", tag: "Comercial",
      location: "Juazeiro do Norte, CE",
      images: ["comercial_1", "comercial_2"]
    }
  ];

  var interiors = [
    { img: "interior_kitchen1", cat: "Cozinha" },
    { img: "interior_living3", cat: "Sala de estar" },
    { img: "interior_bedroom1", cat: "Suíte" },
    { img: "interior_closet", cat: "Closet" },
    { img: "interior_kitchen3", cat: "Cozinha" },
    { img: "interior_bathroom", cat: "Banheiro" },
    { img: "interior_kids1", cat: "Quarto infantil" },
    { img: "interior_living1", cat: "Sala de estar" }
  ];

  function imgFull(name){ return "images/" + name + ".jpg"; }
  function imgThumb(name){ return "images/thumbs/" + name + ".jpg"; }

  /* ===================================================
     RENDER: featured + grid
     =================================================== */
  var featuredProject = projects.filter(function(p){ return p.featured; })[0];
  var gridProjects = projects.filter(function(p){ return !p.featured; });

  var featuredEl = document.getElementById("featuredProject");
  if (featuredProject){
    var f = document.createElement("div");
    f.className = "featured";
    f.setAttribute("data-project", featuredProject.id);
    f.innerHTML =
      '<img src="' + imgThumb(featuredProject.images[0]) + '" loading="lazy" alt="' + featuredProject.name + ' — ' + featuredProject.location + '">' +
      '<div class="featured-info">' +
        '<div><span class="tag">' + featuredProject.tag + ' — ' + featuredProject.location + '</span>' +
        '<h3>' + featuredProject.name + '</h3></div>' +
        '<span class="view">Ver projeto</span>' +
      '</div>';
    featuredEl.appendChild(f);
  }

  var gridEl = document.getElementById("projectsGrid");
  gridProjects.forEach(function(p){
    var t = document.createElement("div");
    t.className = "tile";
    t.setAttribute("data-project", p.id);
    t.innerHTML =
      '<img src="' + imgThumb(p.images[0]) + '" loading="lazy" alt="' + p.name + ' — ' + p.location + '">' +
      '<div class="tile-info">' +
        '<span class="tag">' + p.tag + '</span>' +
        '<h4>' + p.name + '</h4>' +
        '<span class="loc">' + p.location + '</span>' +
      '</div>';
    gridEl.appendChild(t);
  });

  var interiorsEl = document.getElementById("interiorsGrid");
  interiors.forEach(function(item, idx){
    var t = document.createElement("div");
    t.className = "tile";
    t.setAttribute("data-interior", idx);
    t.innerHTML =
      '<img src="' + imgThumb(item.img) + '" loading="lazy" alt="' + item.cat + '">' +
      '<div class="tile-info"><h4>' + item.cat + '</h4></div>';
    interiorsEl.appendChild(t);
  });

  /* ===================================================
     LIGHTBOX
     =================================================== */
  var lb = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbTitle = document.getElementById("lbTitle");
  var lbSub = document.getElementById("lbSub");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var lbClose = document.getElementById("lbClose");

  var currentSet = [];   // array of {full, title, sub}
  var currentIndex = 0;

  function buildSetFromProject(p){
    return p.images.map(function(imgName, i){
      return {
        full: imgFull(imgName),
        title: p.name,
        sub: p.tag + " — " + p.location + " · " + (i + 1) + "/" + p.images.length
      };
    });
  }

  function buildSetFromInteriors(){
    return interiors.map(function(item, i){
      return {
        full: imgFull(item.img),
        title: item.cat,
        sub: "Interiores · " + (i + 1) + "/" + interiors.length
      };
    });
  }

  function openLightbox(set, index){
    currentSet = set;
    currentIndex = index;
    renderLightbox();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderLightbox(){
    var item = currentSet[currentIndex];
    lbImage.classList.remove("is-visible");
    var pre = new Image();
    pre.onload = function(){
      lbImage.src = item.full;
      lbImage.alt = item.title;
      requestAnimationFrame(function(){ lbImage.classList.add("is-visible"); });
    };
    pre.src = item.full;
    lbTitle.textContent = item.title;
    lbSub.textContent = item.sub;
  }

  function closeLightbox(){
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function step(dir){
    currentIndex = (currentIndex + dir + currentSet.length) % currentSet.length;
    renderLightbox();
  }

  document.querySelectorAll(".featured, .tile[data-project]").forEach(function(el){
    el.addEventListener("click", function(){
      var id = el.getAttribute("data-project");
      var p = projects.filter(function(x){ return x.id === id; })[0];
      if (!p) return;
      openLightbox(buildSetFromProject(p), 0);
    });
  });

  document.querySelectorAll(".tile[data-interior]").forEach(function(el){
    el.addEventListener("click", function(){
      var idx = parseInt(el.getAttribute("data-interior"), 10);
      openLightbox(buildSetFromInteriors(), idx);
    });
  });

  lbPrev.addEventListener("click", function(){ step(-1); });
  lbNext.addEventListener("click", function(){ step(1); });
  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function(e){
    if (e.target === lb || e.target.classList.contains("lightbox-inner")) closeLightbox();
  });
  document.addEventListener("keydown", function(e){
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ===================================================
     NAV: scroll state + mobile toggle
     =================================================== */
  var nav = document.getElementById("nav");
  function onScroll(){
    if (window.scrollY > 40){ nav.classList.add("is-scrolled"); }
    else { nav.classList.remove("is-scrolled"); }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function(){
    var isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      document.body.classList.remove("nav-open");
    });
  });

  /* ===================================================
     Hero video — respeita "reduzir movimento"
     =================================================== */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo){
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches){ heroVideo.pause(); }
    reduceMotion.addEventListener && reduceMotion.addEventListener("change", function(e){
      if (e.matches){ heroVideo.pause(); } else { heroVideo.play(); }
    });
  }

  /* ===================================================
     Reveal on scroll — section headers only
     =================================================== */
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("is-visible"); });
  }

})();
