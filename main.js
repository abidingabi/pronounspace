// chosen somewhat arbitrarily so the default list is not ridiculously long
const common_pronouns = ["he/him", "it/its", "she/her", "they/them", "xe/xem"];

// used to uniquely name input boxes
let input_box_count = 0;
function create_input_box(pronoun) {
  const id = "input-box-" + input_box_count;
  const template = document.querySelector("#input-box");
  const clone = template.content.cloneNode(true);

  const label = clone.querySelector("label");
  const input = clone.querySelector("input");

  label.for = id;
  label.innerHTML = pronoun;
  input.id = id;
  input.value = input_box_count;

  document.querySelector("#input-boxes").appendChild(clone);

  input_box_count++;
}

function render_output() {
  const pronouns = Array.from(
    document.querySelectorAll(".coefficient-label")
  ).map((label) => label.innerHTML);
  const coeffs = Array.from(
    document.querySelectorAll(".coefficient-input")
  ).map((input) => input.value);

  const pairs = pronouns.map((pronoun, i) => {
    return { pronoun: pronoun, coeff: coeffs[i] };
  });

  // sort in alphabetical order
  pairs.sort((a, b) => (a.pronoun > b.pronoun) - (a.pronoun < b.pronoun));

  const square_magnitude = pairs
    .map((p) => p.coeff * p.coeff)
    .reduce((a, b) => a + b);

  const unnormalized_tex = pairs
    .map((pair) => {
      const pronoun = pair.pronoun;
      const coeff = pair.coeff;

      // do not show basis vectors with a zero coefficeint
      if (coeff == 0) return null;

      // do not show coefficients for vectors with a coefficient of one
      const coeff_text = coeff == 1 ? "" : coeff + "\\,";

      return coeff_text + " \\overrightarrow{\\text{" + pronoun + "}}";
    })
    .filter((term) => term != null)
    .join(" + ");

  const normalized_tex = pairs
    .map((pair) => {
      const pronoun = pair.pronoun;
      const coeff = pair.coeff;

      // do not show basis vectors with a zero coefficeint
      if (coeff == 0) return null;

      // for case where we have an overall normalized coeff of 1, show no text
      if (coeff * coeff == square_magnitude) {
        return "\\overrightarrow{\\text{" + pronoun + "}}";
      }

      // check if square_magnitude is a perfect square
      const coeff_text = Math.sqrt(square_magnitude) % 1 == 0 ?
            "\\frac{" + coeff + "}{" + Math.sqrt(square_magnitude) + "}\\,"
            : "\\frac{" + coeff + "}{\\sqrt{" + square_magnitude + "}}\\,";

      return coeff_text + "\\overrightarrow{\\text{" + pronoun + "}}";
    })
    .filter((term) => term != null)
    .join(" + ");

  const out_unnormalized = document.querySelector("#output-unnormalized");
  const out_normalized = document.querySelector("#output-normalized");
  out_unnormalized.innerHTML = "$$" + unnormalized_tex + "$$";
  out_normalized.innerHTML = "$$" + normalized_tex + "$$";

  const nodes = [out_unnormalized, out_normalized];

  MathJax.typeset(nodes);
}

function add_pronoun_set() {
  const pronoun = document.querySelector("#custom-pronoun-set").value;
  document.querySelector("#custom-pronoun-set").value = "";

  create_input_box(pronoun);
  render_output();
}

window.onload = () => {
  for (const pronoun of common_pronouns) {
    create_input_box(pronoun);
  }

  render_output();
};
