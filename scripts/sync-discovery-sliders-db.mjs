import { query, execute } from "../lib/db/client.js";
import { architecturalArtData, popularStatuesData } from "../content/discovery-sliders.js";

async function main() {
  console.log("Updating homepage_discovery_arch in DB page_sections...");
  await execute(
    "UPDATE page_sections SET content_json = ? WHERE key_name = 'homepage_discovery_arch'",
    [JSON.stringify(architecturalArtData)]
  );

  await execute(
    "UPDATE page_sections SET content_json = ? WHERE key_name = 'homepage_discovery_statues'",
    [JSON.stringify(popularStatuesData)]
  );

  console.log("Successfully synced DB page_sections with updated discovery sliders!");
  process.exit(0);
}

main().catch(err => {
  console.error("Failed to update page_sections:", err);
  process.exit(1);
});
