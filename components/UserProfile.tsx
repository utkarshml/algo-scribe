
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Target, Code } from 'lucide-react';


type userProp = {
  name: string;
  username: string;
  totalSolved: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  rank: 'Beginner' | 'Intermediate' | 'Expert';
  favoriteTopics: string[];
}
const UserProfile = ({name , username , totalSolved , easyCompleted , mediumCompleted , hardCompleted , rank , favoriteTopics } : userProp) => {

  return (
    <div className="mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{name}</h1>
              <p className="text-purple-200 mb-2">{username}</p>
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                {rank}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{totalSolved}</div>
                  <div className="text-xs text-purple-200">Total Solved</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Code className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{favoriteTopics.length - 1}</div>
                  <div className="text-xs text-purple-200">Favorite Topics</div>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-300">{easyCompleted}</div>
                  <div className="text-xs text-green-200">Easy</div>
                </div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-300">{mediumCompleted}</div>
                  <div className="text-xs text-yellow-200">Medium</div>
                </div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-300">{hardCompleted}</div>
                  <div className="text-xs text-red-200">Hard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
