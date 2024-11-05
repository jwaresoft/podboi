import { ID3Writer } from 'browser-id3-writer';
import { readFileSync, writeFileSync } from 'fs';
import { downloadFileToMemory } from '../handleFiles/handleFiles.js'



/**
 * Add episode data as tags
 * 
 * https://exiftool.org/TagNames/ID3.html
 * 
 * @param {*} filePath
 * @param {*} episode
 * @param {*} fallbackImage
 */
export async function tagPodcastEpisode(filePath, episode) {
  const songBuffer = readFileSync(filePath);
  const coverBuffer = await downloadFileToMemory(episode.image)
  
  const writer = new ID3Writer(songBuffer);
  writer
    .setFrame('TIT2', episode.title)
    .setFrame('TPE1', [episode.feedName])
    .setFrame('COMM', {
      language: 'eng',
      description: '',
      text: episode.description
    })
    .setFrame('TYER', episode.date.getFullYear().toString())

  if(coverBuffer) {
    writer.setFrame('APIC', {
      type: 3,
      data: coverBuffer,
      description: 'Episode Art',
    });
  } else {
    console.warn(`WARNING! Could not get episode art for ${episode.title}.`)
  }

  writer.addTag();
  
  const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
  writeFileSync(filePath, taggedSongBuffer);
}
