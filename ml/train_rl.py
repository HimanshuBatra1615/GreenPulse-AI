import os
import gymnasium as gym
from gymnasium import spaces
import numpy as np
from stable_baselines3 import PPO

class SMEEnergyEnv(gym.Env):
    """Custom Environment that follows gym interface"""
    metadata = {'render.modes': ['console']}

    def __init__(self):
        super(SMEEnergyEnv, self).__init__()
        # Actions: 0: Reduce Load, 1: Normal, 2: Increase Load (buy cheap)
        self.action_space = spaces.Discrete(3)
        
        # State: [Current Hour, Current Load, Current Tariff]
        self.observation_space = spaces.Box(low=np.array([0, 0, 0]), 
                                            high=np.array([23, 500, 100]), 
                                            dtype=np.float32)
        
        self.current_hour = 0
        self.current_load = 100
        self.base_tariff = 10
        self.max_steps = 24
        self.current_step = 0

    def get_tariff(self, hour):
        # Peak hours: 14:00 - 18:00
        if 14 <= hour <= 18:
            return self.base_tariff * 3.0
        return self.base_tariff

    def step(self, action):
        tariff = self.get_tariff(self.current_hour)
        
        if action == 0: # Reduce Load (Shift tasks)
            self.current_load = max(50, self.current_load - 20)
        elif action == 2: # Increase Load
            self.current_load = min(200, self.current_load + 20)
            
        # Cost is load * tariff
        cost = self.current_load * tariff
        
        # Goal is MINIMIZE cost, so reward is negative cost
        reward = -cost
        
        self.current_hour = (self.current_hour + 1) % 24
        self.current_step += 1
        
        done = self.current_step >= self.max_steps
        
        obs = np.array([self.current_hour, self.current_load, self.get_tariff(self.current_hour)], dtype=np.float32)
        info = {}
        
        return obs, reward, done, False, info

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_hour = 0
        self.current_load = 100
        self.current_step = 0
        obs = np.array([self.current_hour, self.current_load, self.get_tariff(self.current_hour)], dtype=np.float32)
        return obs, {}

def train_rl_agent():
    print("Setting up Custom SME Energy Environment...")
    env = SMEEnergyEnv()
    
    print("Training Stable-Baselines3 PPO Agent...")
    model = PPO("MlpPolicy", env, verbose=1)
    # Train for short timeframe to test
    model.learn(total_timesteps=10000)
    
    os.makedirs("saved_models", exist_ok=True)
    model.save("saved_models/ppo_energy_agent")
    print("RL Agent Saved to saved_models/ppo_energy_agent.zip")

if __name__ == "__main__":
    train_rl_agent()
