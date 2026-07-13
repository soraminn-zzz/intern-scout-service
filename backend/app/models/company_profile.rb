class CompanyProfile < ApplicationRecord
  belongs_to :user

  validates :company_name, presence: true
end
