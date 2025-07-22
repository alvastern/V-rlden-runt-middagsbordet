async function getNutrition() {
  const input = document.getElementById("ingredientsInput").value.trim();
  const rows = input.split("\n").filter(row => row.trim() !== "");

  if (rows.length === 0) {
      document.getElementById("result").innerHTML = "Ange minst en ingrediens.";
      return;
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  let resultHTML = "";

  for (const row of rows) {
      const [ingredient, weightStr] = row.trim().split(" ");
      const weight = parseFloat(weightStr);
      if (!ingredient || isNaN(weight)) continue;

      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(ingredient)}&json=1`;

      try {
          const response = await fetch(searchUrl);
          const data = await response.json();
          const product = data.products[0];

          if (!product || !product.nutriments) {
              resultHTML += `<p><b>${ingredient}:</b> Inga näringsdata hittades.</p>`;
              continue;
          }

          const nutriments = product.nutriments;
          const kcal = parseFloat(nutriments["energy-kcal_100g"] || 0);
          const protein = parseFloat(nutriments["proteins_100g"] || 0);
          const fat = parseFloat(nutriments["fat_100g"] || 0);
          const carbs = parseFloat(nutriments["carbohydrates_100g"] || 0);

          const factor = weight / 100;

          totalCalories += kcal * factor;
          totalProtein += protein * factor;
          totalFat += fat * factor;
          totalCarbs += carbs * factor;

          resultHTML += `
              <p><b>${ingredient} (${weight}g):</b> ${Math.round(kcal * factor)} kcal, 
              ${Math.round(protein * factor)}g protein, 
              ${Math.round(fat * factor)}g fett, 
              ${Math.round(carbs * factor)}g kolhydrater.</p>
          `;
      } catch (error) {
          resultHTML += `<p style="color:red;">Fel med ${ingredient}: ${error.message}</p>`;
      }
  }

  resultHTML += `
      <hr>
      <h4>Totalt:</h4>
      <p><b>Kalorier:</b> ${Math.round(totalCalories)} kcal</p>
      <p><b>Protein:</b> ${Math.round(totalProtein)} g</p>
      <p><b>Fett:</b> ${Math.round(totalFat)} g</p>
      <p><b>Kolhydrater:</b> ${Math.round(totalCarbs)} g</p>
  `;

  document.getElementById("result").innerHTML = resultHTML;
}