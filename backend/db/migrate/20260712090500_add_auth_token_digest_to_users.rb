class AddAuthTokenDigestToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :auth_token_digest, :string
  end
end
