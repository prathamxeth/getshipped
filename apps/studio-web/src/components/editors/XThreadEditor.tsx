'use client';

import React from 'react';
import { Plus, Trash2, Video, Image, FileCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { XTweet } from '@getshipped/shared-types';

export interface XThreadEditorProps {
  tweets: XTweet[];
  onChange: (updatedTweets: XTweet[]) => void;
}

export const XThreadEditor: React.FC<XThreadEditorProps> = ({ tweets, onChange }) => {
  const handleTweetChange = (index: number, newText: string) => {
    const updated = [...tweets];
    updated[index] = {
      ...updated[index],
      text: newText,
      characterCount: newText.length,
    };
    onChange(updated);
  };

  const handleAddTweet = () => {
    const nextNumber = tweets.length + 1;
    const newTweet: XTweet = {
      id: `tweet_${Date.now()}`,
      tweetNumber: nextNumber,
      totalTweets: nextNumber,
      text: '',
      characterCount: 0,
      mediaPlaceholder: 'none',
      mediaType: 'none',
    };
    const updated = [...tweets, newTweet].map((t) => ({
      ...t,
      totalTweets: nextNumber,
    }));
    onChange(updated);
  };

  const handleDeleteTweet = (index: number) => {
    if (tweets.length <= 1) return;
    const filtered = tweets.filter((_, i) => i !== index);
    const updated = filtered.map((t, i) => ({
      ...t,
      tweetNumber: i + 1,
      totalTweets: filtered.length,
    }));
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>X (Twitter) Launch Thread</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              {tweets.length} Tweets
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Optimized for technical engagement with code diff attachments and architecture hooks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddTweet}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tweet</span>
        </button>
      </div>

      {/* Tweet Cards List with Thread Connector Line */}
      <div className="flex flex-col gap-4 relative">
        {tweets.map((tweet, idx) => {
          const charLimit = 280;
          const charsLeft = charLimit - tweet.text.length;
          const isOver = charsLeft < 0;
          const isWarning = charsLeft <= 20 && charsLeft >= 0;

          return (
            <div
              key={tweet.id || idx}
              className="relative p-5 rounded-xl bg-slate-900/70 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3 group"
            >
              {/* Top Meta: Tweet Index & Attachment Pill */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-300">
                    Tweet {idx + 1} of {tweets.length}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      Hook Tweet
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Media placeholder indicator */}
                  {tweet.mediaPlaceholder && tweet.mediaPlaceholder !== 'none' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                      {tweet.mediaType === 'video' && <Video className="w-3 h-3 text-emerald-400" />}
                      {tweet.mediaType === 'diagram' && <Image className="w-3 h-3 text-cyan-400" />}
                      {tweet.mediaType === 'code_diff' && <FileCode className="w-3 h-3 text-purple-400" />}
                      <span>{tweet.mediaPlaceholder}</span>
                    </div>
                  )}

                  {/* Delete button (if more than 1 tweet) */}
                  {tweets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTweet(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete Tweet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Textarea for tweet text */}
              <textarea
                value={tweet.text}
                onChange={(e) => handleTweetChange(idx, e.target.value)}
                rows={4}
                className="w-full bg-slate-950/60 rounded-lg p-3 text-sm text-slate-100 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-sans resize-y leading-relaxed"
                placeholder="Write your tweet..."
              />

              {/* Bottom Character Counter & Status */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  {isOver ? (
                    <div className="flex items-center gap-1 text-red-400 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{Math.abs(charsLeft)} chars over limit</span>
                    </div>
                  ) : isWarning ? (
                    <span className="text-amber-400 font-medium">{charsLeft} characters remaining</span>
                  ) : (
                    <span className="text-slate-400">{charsLeft} characters left</span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={isOver ? 'text-red-400 font-bold' : isWarning ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {tweet.text.length} / {charLimit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
