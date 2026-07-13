class InternProfile < ApplicationRecord
  belongs_to :user

  validates :school_name, presence: true
end
