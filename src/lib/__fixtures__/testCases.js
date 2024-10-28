import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const fileFullPath = fileURLToPath(import.meta.url);
const pathToHere = path.dirname(fileFullPath);

/**
 * Test cases for rss feeds, pulled from random sites to try and increase oddball values
 */
export const testCases = [
  {
    xmlFixtureLocation: path.join(
      pathToHere,
      "rssXML",
      "test_feed_call_her_daddy.xml"
    ),
    jsonFixtureLocation: path.join(
      pathToHere,
      "rssJSON",
      "test_feed_call_her_daddy.json"
    ),
    testData: {
      title: "Call Her Daddy",
      feedImage:
        "https://image.simplecastcdn.com/images/5b7d8c77-15ba-4eff-a999-2e725db21db5/06e5816c-eedf-4569-93c6-e65ff6bc3d91/3000x3000/sxm-cover-call-her-daddy-3000x3000-final-1-left-black.jpg?aid=rss_feed",
      latestEpisode: {
        date: "2024-10-25T07:00:00.000Z",
        description:
          "Kelsea Ballerini joins Call Her Daddy, and for the first time ever, shares the full account of her relationship and divorce from country singer Morgan Evans. Kelsea and Morgan met when she was only 22 years old and the pair got engaged nine months later. Kelsea opens up about the struggles in their marriage and the moment she realized divorce was the only option.\n",
        image: "",
        mp3Url:
          "https://chrt.fm/track/288D49/stitcher.simplecastaudio.com/f09b6967-f720-4383-a6cf-42d1f475bd95/episodes/b96463ce-66de-44ca-838e-271b9c3dd35d/audio/128/default.mp3?aid=rss_feed&awCollectionId=f09b6967-f720-4383-a6cf-42d1f475bd95&awEpisodeId=b96463ce-66de-44ca-838e-271b9c3dd35d&feed=mKn_QmLS",
        title: "Kelsea Ballerini: Divorced at 29 (FBF)",
        rawDescription:
          "Kelsea Ballerini joins Call Her Daddy, and for the first time ever, shares the full account of her relationship and divorce from country singer Morgan Evans. Kelsea and Morgan met when she was only 22 years old and the pair got engaged nine months later. Kelsea opens up about the struggles in their marriage and the moment she realized divorce was the only option.\n",
      },
    },
  },
  {
    xmlFixtureLocation: path.join(pathToHere, "rssXML", "test_feed_chapo.xml"),
    jsonFixtureLocation: path.join(
      pathToHere,
      "rssJSON",
      "test_feed_chapo.json"
    ),
    testData: {
      title: "Chapo Trap House",
      feedImage:
        "https://i1.sndcdn.com/avatars-000230770726-ib4tc4-original.jpg",
      latestEpisode: {
        date: "2024-10-23T18:03:00.000Z",
        description:
          "[Note: these Movie Mindset Horrortober Season 1 episodes were already unlocked for free this year over on the Patreon feed, just adding them to the public feed to make them more widely available. To get every Movie Mindset episode, subscribe at patreon.com/chapotraphouse.]\n" +
          "\n" +
          "Brendan James returns to take on two triumphant works from writers-turned-directors: Clive Barker’s “Hellraiser” (1987) and William Peter Blatty’s “The Exorcist III” (1990). Both films feature visions of Hell’s intrusion onto earth; two competing and complementary visions of evil, one from a gay British man and the second from a devout American Catholic. Will, Hesse and Brendan go deep on these films, highlighting in Hellraiser some of the most ghoulish practical effects ever put to screen, and in Exorcist III dissecting one of the most infamous jump-scares in film history.",
        image:
          "https://i1.sndcdn.com/artworks-KnA3adg4ZhXTvSWq-btPKrw-t3000x3000.jpg",
        mp3Url:
          "https://dts.podtrac.com/redirect.mp3/feeds.soundcloud.com/stream/1939607402-chapo-trap-house-mm15-save-your-servants-barker-blatty-writers-in-hell.mp3",
        title: "MM15 - Save Your Servants!: Barker, Blatty & Writers In Hell",
        rawDescription:
          "[Note: these Movie Mindset Horrortober Season 1 episodes were already unlocked for free this year over on the Patreon feed, just adding them to the public feed to make them more widely available. To get every Movie Mindset episode, subscribe at patreon.com/chapotraphouse.]\n" +
          "\n" +
          "Brendan James returns to take on two triumphant works from writers-turned-directors: Clive Barker’s “Hellraiser” (1987) and William Peter Blatty’s “The Exorcist III” (1990). Both films feature visions of Hell’s intrusion onto earth; two competing and complementary visions of evil, one from a gay British man and the second from a devout American Catholic. Will, Hesse and Brendan go deep on these films, highlighting in Hellraiser some of the most ghoulish practical effects ever put to screen, and in Exorcist III dissecting one of the most infamous jump-scares in film history.",
      },
    },
  },
  {
    xmlFixtureLocation: path.join(pathToHere, "rssXML", "test_feed_guys.xml"),
    jsonFixtureLocation: path.join(
      pathToHere,
      "rssJSON",
      "test_feed_guys.json"
    ),
    testData: {
      title: "Guys: With Bryan Quinby",
      feedImage:
        "https://static.libsyn.com/p/assets/0/6/7/1/067168d18ca95c5de5bbc093207a2619/boxes_1_color_resized.png",
      latestEpisode: {
        date: "2024-10-22T12:00:00.000Z",
        description:
          "About a month ago my wife asked me if we had ever considered doing a an episode about lottery guys and I looked at my big list and they weren't there. I loved the idea so much that we did it. What do you tell your friends and family when you win? How do you win scratch offs? Why is Chris making fun of me again?  Tom is our dear friend and he is at https://x.com/thetrillbillies and  Trillbillies and at https://www.patreon.com/trillbillyworkersparty There is much more Chris at twitter.com/thecjs and of course https://www.patreon.com/notevenashow And for more Guys content, streams and SHOCKTOBER: a deep dive into shock jocks you can click patreon.com/guyspodcast twitter.com/murderxbryan and  https://bsky.app/profile/murderxbryan.bsky.social  Guys is on Instagram! https://www.instagram.com/guys.pod Guys has a Post Office Box now! PO Box 10769 Columbus Ohio 43201",
        image:
          "https://static.libsyn.com/p/assets/4/c/6/b/4c6b66f88198720827a2322813b393ee/images_2.jpg",
        mp3Url:
          "https://traffic.libsyn.com/secure/bdd66b71-1e02-45c7-ad9e-0b9aadb7926b/Lotto_Guys_DONE.mp3?dest-id=3861642",
        title: "Guys: Episode 90 - Lottery Guys with Tom Sexton",
        rawDescription:
          "About a month ago my wife asked me if we had ever considered doing a an episode about lottery guys and I looked at my big list and they weren't there. I loved the idea so much that we did it. What do you tell your friends and family when you win? How do you win scratch offs? Why is Chris making fun of me again?  Tom is our dear friend and he is at https://x.com/thetrillbillies and  Trillbillies and at https://www.patreon.com/trillbillyworkersparty There is much more Chris at twitter.com/thecjs and of course https://www.patreon.com/notevenashow And for more Guys content, streams and SHOCKTOBER: a deep dive into shock jocks you can click patreon.com/guyspodcast twitter.com/murderxbryan and  https://bsky.app/profile/murderxbryan.bsky.social  Guys is on Instagram! https://www.instagram.com/guys.pod Guys has a Post Office Box now! PO Box 10769 Columbus Ohio 43201",
      },
    },
  },
  {
    xmlFixtureLocation: path.join(
      pathToHere,
      "rssXML",
      "test_feed_joe_rogan.xml"
    ),
    jsonFixtureLocation: path.join(
      pathToHere,
      "rssJSON",
      "test_feed_joe_rogan.json"
    ),
    testData: {
      title: "The Joe Rogan Experience",
      feedImage:
        "https://megaphone.imgix.net/podcasts/8e5bcebc-ca16-11ee-89f0-0fa0b9bdfc7c/image/05de50adade05c16262eab5c7ed1dd66.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
      latestEpisode: {
        date: "2024-10-27T02:00:00.000Z",
        description:
          "Joe is joined by Eddie Bravo, Brendan Schaub & Bryan Callen to watch the fights on October 26, 2024.\n" +
          "Learn more about your ad choices. Visit podcastchoices.com/adchoices",
        image:
          "https://megaphone.imgix.net/podcasts/219aef60-8f2d-11ef-89ac-2bbe2740183d/image/0f006e09074e0e4c3d9805c5ad25758b.jpeg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
        mp3Url:
          "https://traffic.megaphone.fm/GLT9131365112.mp3?updated=1730015487",
        title: "Fight Companion - October 26, 2024",
        rawDescription:
          "Joe is joined by Eddie Bravo, Brendan Schaub & Bryan Callen to watch the fights on October 26, 2024.\n" +
          "Learn more about your ad choices. Visit podcastchoices.com/adchoices",
      },
    },
  },
  {
    xmlFixtureLocation: path.join(
      pathToHere,
      "rssXML",
      "test_feed_self_hosted.xml"
    ),
    jsonFixtureLocation: path.join(
      pathToHere,
      "rssJSON",
      "test_feed_self_hosted.json"
    ),
    testData: {
      title: "Self-Hosted",
      feedImage:
        "https://assets.fireside.fm/file/fireside-images-2024/podcasts/images/7/7296e34a-2697-479a-adfb-ad32329dd0b0/cover.jpg",
      latestEpisode: {
        date: "2024-10-18T09:00:00.000Z",
        description:
          '"The" self-hosted app to archive your favorite YouTube channels and easily integrate into Jellyfin/Plex. Plus, our favorite WordPress alternatives and an update on No Google October.',
        image: "",
        mp3Url:
          "https://aphid.fireside.fm/d/1437767933/7296e34a-2697-479a-adfb-ad32329dd0b0/67d7c5d2-558f-4ce0-b9e9-da4db05f532b.mp3",
        title: "134: YouTube Unplugged",
        rawDescription:
          '"The" self-hosted app to archive your favorite YouTube channels and easily integrate into Jellyfin/Plex. Plus, our favorite WordPress alternatives and an update on No Google October.',
      },
    },
  },
];

/**
 * loads fixture file from path
 *
 * @param {*} filePath
 */
export function testCaseLoadFixtureFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content;
}

/**
 * loads JSON file and converts to object
 *
 * @param {*} filePath
 */
export function testCaseLoadJSONasObject(filePath) {
  const json = testCaseLoadFixtureFile(filePath);
  return JSON.parse(json);
}
