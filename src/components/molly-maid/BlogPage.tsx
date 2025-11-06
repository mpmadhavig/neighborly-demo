import React from 'react';
import { blogPosts } from './data';

export const BlogPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-[#071D49]">Practically Spotless Blog</h1>
      <p className="text-xl text-gray-600 mb-8">Expert advice from our team of cleaning specialists</p>

      <div className="space-y-6">
        {blogPosts.map((post, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl hover:border-[#FB4D94] transition">
            <h3 className="text-2xl font-bold mb-3 text-[#071D49]">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <button className="text-[#CF0557] font-semibold hover:underline">
              Read More →
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-8 border-2 border-[#FB4D94]">
        <h2 className="text-2xl font-bold mb-4 text-[#071D49]">Cleaning Tips Categories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">General Household</h4>
            <p className="text-sm text-gray-600">Tips for everyday cleaning tasks</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">Kitchen & Dining</h4>
            <p className="text-sm text-gray-600">Keep your kitchen spotless</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2 text-[#071D49]">Bathroom</h4>
            <p className="text-sm text-gray-600">Deep cleaning strategies</p>
          </div>
        </div>
      </div>
    </div>
  );
};
