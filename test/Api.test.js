import {expect} from 'chai';
import Api from '../src/Api';

describe('Api', function() {
  it('Successfully initializes with defaults.', function() {
    const api = new Api();

    expect(api).to.not.be.empty;
  });

  it('Attaches all of the api modules.', function() {
    const api = new Api();

    expect(api).to.not.be.empty;
    expect(api).to.have.property('ApiChallenge');
    expect(api).to.have.property('Champion');
    expect(api).to.have.property('CurrentGame');
    expect(api).to.have.property('FeaturedGames');
    expect(api).to.have.property('Game');
    expect(api).to.have.property('League');
    expect(api).to.have.property('Static');
    expect(api).to.have.property('Match');
    expect(api).to.have.property('MatchHistory');
    expect(api).to.have.property('Stats');
    expect(api).to.have.property('Status');
    expect(api).to.have.property('Summoner');
    expect(api).to.have.property('Team');
  });

  it('Returns a promise from the api module functions.', function() {
    const api = new Api();
    expect(api.ApiChallenge.get()).to.be.an.instanceOf(Promise);
  });
});
