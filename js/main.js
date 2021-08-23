function init() {
  gsap.set(".projects", { autoAlpha: 1 });
  gsap.set(".project", { x: "-100%" });
  let currentStep = 1;
  let totalSlides = document.querySelectorAll(".project").length;

  createTimelineIn("next", currentStep);

  function createTimelineIn(direction, index) {
    const goPrev = direction === "prev";

    const element = document.querySelector("div.project0" + index),
      projectClasses = element.className.split(" "),
      projectClass = projectClasses[1],
      title = element.querySelector(".project-title"),
      subtitle = element.querySelector(".project-subtitle"),
      button = element.querySelector(".button-container");
    const tlIn = gsap.timeline({
      defaults: {
        modifiers: {
          x: gsap.utils.unitize(function(x) {
            return goPrev ? Math.abs(x) : x;
          })
        }
      }
    });
    tlIn
      .fromTo(
        element,
        {
          autoAlpha: 0,
          x: "-100%"
        },
        {
          duration: 0.7,
          x: 0,
          autoAlpha: 1,
          ease: Power4.out,
          onStart: updateClass,
          onStartParams: [projectClass]
        }
      )
      .from([title, subtitle, button], {
        duration: 0.4,
        x: -60,
        autoAlpha: 0,
        stagger: 0.09
      });
    return tlIn;
  }

  function createTimelineOut(direction, index) {
    const goPrev = direction === "prev";
    const tlOut = gsap.timeline();
    const element = document.querySelector("div.project0" + index);
    tlOut.to(element, {
      duration: 0.7,
      autoAlpha: 0,
      x: 250,
      ease: "back.in(2)",
      modifiers: {
        x: gsap.utils.unitize(function(x) {
          return goPrev ? -x : x;
        })
      }
    });

    return tlOut;
  }

  function updateCurrentStep(goToIndex) {
    currentStep = goToIndex;
    document.querySelectorAll(".dot").forEach((element, index) => {
      element.setAttribute("class", "dot");
      if (index + 1 === currentStep) {
        element.classList.add("active");
      }
    });
    positionDot();
  }

  function transition(direction, toIndex) {
    const tlTransition = gsap.timeline({
      onStart: () => {
        updateCurrentStep(toIndex);
      }
    });
    let tlIn = createTimelineIn(direction, toIndex),
      tlOut = createTimelineOut(direction, currentStep);
    tlTransition.add(tlOut).add(tlIn);

    return tlTransition;
  }

  function isTweening() {
    return gsap.isTweening(".project");
  }

  document.querySelector("button.next").addEventListener("click", e => {
    e.preventDefault();
    const isLast = currentStep === totalSlides;
    const nextStep = isLast ? 1 : currentStep + 1;
    !isTweening() && transition("next", nextStep);
  });
  document.querySelector("button.prev").addEventListener("click", e => {
    e.preventDefault();
    const isFirst = currentStep === 1;
    const prevStep = isFirst ? totalSlides : currentStep - 1;
    !isTweening() && transition("prev", prevStep);
  });

  function updateClass(projectClass) {
    document.querySelector("body").className = projectClass;
  }

  function createNavigation() {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "dots");

    const spot = document.createElement("spot");
    spot.setAttribute("class", "spot");

    for (let i = 1; i < totalSlides + 1; i++) {
      const element = document.createElement("button");
      const text = document.createTextNode(i);
      element.appendChild(text);
      element.setAttribute("class", "dot");
      if (currentStep === i) {
        element.classList.add("active");
      }

      element.addEventListener("click", () => {
        if (!isTweening() && currentStep !== i) {
          const direction = i > currentStep ? "next" : "prev";
          transition(direction, i);
        }
      });

      newDiv.appendChild(element);
    }
    newDiv.appendChild(spot);
    document.querySelector(".projects").appendChild(newDiv);
    positionDot();
  }

  function positionDot() {
    const activeDotX = document.querySelector(".dot.active").offsetLeft;
    const spot = document.querySelector(".spot");
    const spotX = spot.offsetLeft;
    const destinationX = Math.round(activeDotX - spotX + 5);

    const dotTl = gsap.timeline();
    dotTl
      .to(spot, {
        duration: 0.4,
        x: destinationX,
        scale: 2.5,
        ease: "power1.Out"
      })
      .to(spot, {
        duration: 0.2,
        scale: 1,
        ease: "power1.in"
      });
  }

  createNavigation();
}

window.addEventListener("load", function() {
  init();
});
