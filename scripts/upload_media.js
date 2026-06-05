const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_DIR = '/Users/disasgamage/Documents/Toursl ';
const BUCKET_NAME = 'tours_media';

const categories = {
  'Backs ': { name: 'tourists', type: 'image' },
  'tours ': { name: 'visited_places', type: 'image' },
  'Videos ': { name: 'videos', type: 'video' },
};

async function uploadFiles() {
  for (const [folder, meta] of Object.entries(categories)) {
    const dirPath = path.join(BASE_DIR, folder);
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory ${dirPath} does not exist, skipping.`);
      continue;
    }

    const files = fs.readdirSync(dirPath);
    let count = 0;
    
    for (const file of files) {
      if (file.startsWith('.')) continue; // skip hidden files

      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        const fileData = fs.readFileSync(filePath);
        const fileName = `${meta.name}/${Date.now()}_${file.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        console.log(`Uploading ${fileName}...`);
        
        // Determine content type
        let contentType = meta.type === 'video' ? 'video/mp4' : 'image/jpeg';
        if (file.toLowerCase().endsWith('.png')) contentType = 'image/png';
        if (file.toLowerCase().endsWith('.webp')) contentType = 'image/webp';
        if (file.toLowerCase().endsWith('.mov')) contentType = 'video/quicktime';

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, fileData, {
            contentType,
            upsert: false
          });

        if (error) {
          console.error(`Error uploading ${file}:`, error.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        const url = publicUrlData.publicUrl;

        // Insert into database
        const { error: dbError } = await supabase
          .from('media')
          .insert({
            name: file,
            url: url,
            type: meta.type,
            category: meta.name
          });

        if (dbError) {
          console.error(`Error saving ${file} to DB:`, dbError.message);
        } else {
          count++;
        }
        
        // Delay to prevent fetch failure
        await new Promise(r => setTimeout(r, 300));
      }
    }
    console.log(`Successfully uploaded ${count} files from ${folder}`);
  }
}

uploadFiles().then(() => {
  console.log("Upload process completed.");
}).catch(console.error);
