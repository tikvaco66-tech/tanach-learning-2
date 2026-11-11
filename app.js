const content = document.getElementById("content");
document.querySelectorAll(".grade").forEach(button => {
  button.addEventListener("click", () => {
    const grade = button.dataset.grade;
    content.innerHTML = `
      <div class="welcome-card">
        <h2>כיתה ${grade}</h2>
        <p>אזור הלמידה של כיתה ${grade} הוכן במבנה האתר.</p>
        <p>בשלב הבא נכניס לכאן את יחידות התנ״ך המלאות, לפי פרקי החובה בתוכנית הלימודים.</p>
      </div>`;
    content.scrollIntoView({behavior:"smooth",block:"start"});
  });
});
